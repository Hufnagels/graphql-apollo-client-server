import {
  gql
} from "@apollo/client";

// QUERIES
export const GET_USERS = gql`
  query GetUsers($search: String, $page: Int, $limit: Int) {
    getUsers(search: $search, page: $page, limit: $limit) {
      users {
        _id
        # username
        firstName
        lastName
        email
        date_of_birth
        updatedAt
        createdAt
      }
      currentPage
      totalPages
      count
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(_id: $id) {
      _id
      # username
      firstName
      lastName
      email
      date_of_birth
      token
      # ... on UserNotFoundError {
      #   message
      # }
      # ... on User {
      #   _id
      #   username
      #   firstName
      #   lastName
      #   email
      # }
    }
  }
`

// MUTATIONS
export const CREATE_USER = gql`
  mutation CreateUser($input: UserInputCreate!) {
    createUser(input: $input) {
      user {
        _id
        firstName
        lastName
        date_of_birth
        email
        password
        token
      }
      tokens {
        accessToken
        refreshToken
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserInputUpdate!) {
    updateUser(_id: $id, input: $input) {
      firstName
      lastName
      date_of_birth
      token
    }
  }
`;

export const DELETE_USER = gql`
  mutation($id: String) {
    deleteUser(id: $id)
  }
`
export const LOGIN_USER = gql`
  mutation LoginUser($input: UserInputLogin) {
    loginUser(input: $input) {
      user {
        _id
        lastName
        firstName
        email
        token
      }
      tokens {
        accessToken
        refreshToken
      }
    }
  }
`