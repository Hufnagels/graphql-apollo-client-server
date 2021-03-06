import {
  gql
} from "@apollo/client";

export const GET_MINDMAPS = gql`
  query GetMindmaps($search: String, $page: Int, $limit: Int) {
    getMindmaps(search: $search, page: $page, limit: $limit) {
      mindmaps {
        _id
        owner
        title
        description
        originalMap
        currentMap
        mapimage
        editinghistory {
          editedMap
          updated
        }
        createdAt
        updatedAt
      }
      currentPage
      totalPages
      count
    }
  }
`;

export const GET_MINDMAP = gql`
  query GetMindmap($id: ID!) {
    getMindmap(_id: $id) {
      _id
      owner
      title
      description
      originalMap
      currentMap
      mapimage
      editinghistory {
        editedMap
        updated
      }
      createdAt
      updatedAt
    }
  }
`

// MUTATIONS
export const CREATE_MINDMAP = gql`
  mutation CreateMindmap($input: MindmapInputCreate) {
    createMindmap(input: $input) {
      mindmap {
        owner
        title
        description
        originalMap
        currentMap
        mapimage
      }
      mindmapErrors {
        message
        locations
        path
      }
    }
  }
`;

export const DELETE_MINDMAP = gql`
  mutation($id: ID!) {
    deleteMindmap(_id: $id)
  }
`
