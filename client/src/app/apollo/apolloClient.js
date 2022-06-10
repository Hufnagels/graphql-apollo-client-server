import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  split,
} from '@apollo/client';
// import { withClientState } from 'apollo-link-state';
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { ApolloProvider } from '@apollo/react-hooks'

// Custom
import { store } from '../store/store'
import { REACT_APP_LS_TOKEN_NAME, REACT_APP_API_URL } from '../config/config'

if (process.env.NODE_ENV !== 'production') {
  // console.log('apolloClient NODE_ENV', process.env.NODE_ENV)
  // console.log('apolloClient REACT_APP_API_URL', process.env.REACT_APP_API_URL)
}


const httpLink = new HttpLink({
  uri: `http://${process.env.REACT_APP_API_URL}/graphql`,
  //credentials: 'include',

})

const authLink = setContext((_, { headers }) => {
  const token = !store.getState().auth.tokens ? false : (store.getState().auth.tokens.accessToken) //|| localStorage.getItem(REACT_APP_LS_TOKEN_NAME) || ""
  // console.info('apolloClient authLink STORE', store.getState().auth)
  // console.info('apolloClient authLink TOKEN',token)
  // console.info('apolloClient authLink HEADERS', headers)
  return {
    headers: {
      ...headers,
      // AccesControllAllowOrigin: "http://localhost:3000",
        // "Access-Control-Allow-Origin": "http://localhost:3000",
      //   "Access-Control-Allow-Credentials" : true,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

const wsLink = new GraphQLWsLink(createClient({
  url: `ws://${process.env.REACT_APP_API_URL}/subscriptions`,
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
/**/
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors){
    if (process.env.NODE_ENV !== 'production')
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
  
    return graphQLErrors
  }

  if (networkError) {
    if (process.env.NODE_ENV !== 'production') 
      console.log(`[Network error]: ${networkError}`)
  }
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    // errorPolicy: 'none',
  },
  query: {
    fetchPolicy: 'no-cache',
    // errorPolicy: 'none',
  },
  // mutate: {
    // errorPolicy: 'all',
  // },
}
const cache = new InMemoryCache();
// const stateLink = withClientState({ cache, });

const client = new ApolloClient({
  link: splitLink, //from([errorLink, splitLink]), //splitLink, //tokenLink.concat(splitLink), //from([httpLink, authLink, errorLink]),
  cache,
  connectToDevTools: true,
  //defaultOptions,
  // headers: { 
  //   'Access-Control-Allow-Origin':'localhost, 192.168.1.125',
  // }
});

// client.onResetStore(stateLink.writeDefaults);

const CustomApolloProvider = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}
export default CustomApolloProvider