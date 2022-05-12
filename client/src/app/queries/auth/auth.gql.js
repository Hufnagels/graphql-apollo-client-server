import {
  gql
} from "@apollo/client";

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

export const REFRESH_TOKEN = gql`
  mutation Mutation($input: refreshTokenInput) {
    refreshToken(input: $input) {
      tokens {
        accessToken
        refreshToken
      }
    }
  }
`