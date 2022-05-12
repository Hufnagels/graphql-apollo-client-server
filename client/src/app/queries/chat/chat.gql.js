import {
  gql
} from "@apollo/client";

export const SUBSCRIBE_TO_MESSAGES = gql`
  subscription OnMessageAdded {
    messages {
      id
      user
      content
    }
  }
`;

export const GET_MESSAGES = gql`
  query Messages {
    messages {
      id
      user
      content
    }
  }
`;

export const POST_MESSAGE = gql`
  mutation($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;
