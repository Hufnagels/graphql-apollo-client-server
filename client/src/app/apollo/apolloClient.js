import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context'
import { ApolloProvider } from '@apollo/react-hooks'
import { split, } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

// Custom
import { store, persistor } from '../store/store'
import { REACT_APP_LS_TOKEN_NAME } from '../config/config'

console.log('apolloClient store', store.getState().auth.tokens)

const httpLink = new HttpLink({
  uri: `http://${process.env.REACT_APP_NODESERVER_BASEURL}/graphql`,
})

const authLink = setContext((_, { headers }) => {
  const token = store.getState().auth.tokens.accessToken || localStorage.getItem(REACT_APP_LS_TOKEN_NAME) || ""
  console.log('apolloClient authLink', token)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

const wsLink = new GraphQLWsLink(createClient({
  url: `ws://${process.env.REACT_APP_NODESERVER_BASEURL}/subscriptions`,
  options: {
    lazy: true,
    reconnect: true,

  },
  connectionParams: async () => {
    const token = store.getState().auth.tokens.accessToken || localStorage.getItem(REACT_APP_LS_TOKEN_NAME) || ""
    return {
      headers: {
        authToken: token
      }
    }
  },
  connectionCallback: (error) => {
    console.log('connectionCallback', error)
  },
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);
/*
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => console.dir(
      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
    ),
    )
  if (networkError) console.dir('NetworkError', networkError)
}) */




const client = new ApolloClient({
  //uri: process.env.REACT_APP_NODESERVER_BASEURL,
  link: splitLink, //tokenLink.concat(splitLink), //from([httpLink, authLink, errorLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true
});

const CustomApolloProvider = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}
export default CustomApolloProvider