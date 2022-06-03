import {
  gql
} from "@apollo/client";

// SUBSCRIPTION
export const SUBSCRIBE_TO_BOARD = gql`
  subscription OnElementAdded {
    elements {
      boardid
      elementid
      type
      action
      params
    }
  }
`;

// SUBSCRIPTION MUTATION
export const POST_UPDATED_ELEMENT = gql`
  mutation(
    $boardid: String!, 
    $elementid: String!, 
    $type: String!, 
    $action: String!, 
    $params: String!
  ) {
    postUpdatedElement(
      boardid: $boardid, 
      elementid: $elementid, 
      type: $type, 
      action: $action, 
      params: $params
    )
  }
`;

// QUERIES
export const GET_BOARDS = gql`
  query GetBoards($search: String, $page: Int, $limit: Int) {
    getBoards(search: $search, page: $page, limit: $limit) {
      boards {
        _id
        owner
        title
        description
        board
        boardimage
        editinghistory {
          editedBoard
          updated
        }
        updatedAt
        createdAt
      }
      currentPage
      totalPages
      count
    }
  }
`;

export const GET_BOARD = gql`
  query GetBoard($id: ID!) {
    getBoard(_id: $id) {
      _id
      owner
      title
      description
      board
      boardimage
      editinghistory {
        editedBoard
        updated
      }
    }
  }
`

// MUTATIONS
export const CREATE_BOARD = gql`
  mutation CreateBoard($input: CreateBoardInput) {
    createBoard(input: $input) {
      board {
        owner
        title
        description
        board
        boardimage
      }
      boardErrors {
        message
        locations
        path
      }
    }
  }
`;

export const UPDATE_BOARD = gql`
  mutation UpdateBoard($id: ID!, $input: UpdateBoardInput!) {
    updateBoard(_id: $id, input: $input) {
      _id
      owner
      title
      description
      board
      boardimage
    }
  }
`;

export const DELETE_BOARD = gql`
  mutation($id: ID!) {
    deleteBoard(_id: $id)
  }
`