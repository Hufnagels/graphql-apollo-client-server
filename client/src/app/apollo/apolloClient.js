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
import { store } from '../store/store'
import { REACT_APP_LS_TOKEN_NAME } from '../config/config'

//console.info('apolloClient store, localStorage', store.getState(), REACT_APP_LS_TOKEN_NAME)

const httpLink = new HttpLink({
  uri: `http://${process.env.REACT_APP_NODESERVER_BASEURL}/graphql`,
  
})

const authLink = setContext((_, { headers }) => {
  const token = !store.getState().auth.tokens ? false : (store.getState().auth.tokens.accessToken) //|| localStorage.getItem(REACT_APP_LS_TOKEN_NAME) || ""
console.info('apolloClient authLink', store.getState().auth, token)
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
    const token = !store.getState().auth.tokens ? '' : (store.getState().auth.tokens.accessToken || localStorage.getItem(REACT_APP_LS_TOKEN_NAME) || "")
    return {
      headers: {
        authToken: token
      }
    }
  },
  connectionCallback: (error) => {
    // console.log('connectionCallback', error)
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
    graphQLErrors.forEach(({ message, locations, path }) => console.info(
      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
    ),
    )
  if (networkError) console.info('NetworkError', networkError)
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