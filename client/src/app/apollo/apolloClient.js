import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  from
} from "@apollo/client";
import { onError } from "@apollo/client/link/error"
import { setContext } from "@apollo/client/link/context"

import { split, } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { store, persistor } from '../store/store'
console.log('apolloClient store', store.getState().auth.tokens)



const httpLink = new HttpLink({
  uri: `http://${process.env.REACT_APP_NODESERVER_BASEURL}/graphql`,
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token') || ""
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})
const tokenLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token') || ""
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : 'No valid token found'
    }
  })
  return forward(operation)
})

const wsLink = new GraphQLWsLink(createClient({
  url: `ws://${process.env.REACT_APP_NODESERVER_BASEURL}/subscriptions`,
  connectionParams: async () => {
      const token = localStorage.getItem('token') || store.getState().auth.tokens.accessToken || ""
      return {
        headers: {
          authToken: token
        }
      }
    },
    connectionCallback: (error) => {
      console.log('connectionCallback', error)
    },
  
  options: {
    lazy: true,
    reconnect: true,
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
  tokenLink.concat(httpLink),
);

/* const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token') || ""
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

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