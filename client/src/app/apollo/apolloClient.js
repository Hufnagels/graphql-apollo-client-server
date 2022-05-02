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

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_NODESERVER_BASEURL
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || ""
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

const client = new ApolloClient({
  //uri: process.env.REACT_APP_NODESERVER_BASEURL,
  link: tokenLink.concat(httpLink), //from([httpLink, authLink, errorLink]),
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