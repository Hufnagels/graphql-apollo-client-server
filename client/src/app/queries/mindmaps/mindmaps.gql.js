import {
  gql
} from "@apollo/client";

export const GET_MINDMAPS = gql`
  query GetMindmaps($search: String, $page: Int, $limit: Int) {
    getMindmaps(search: $search, page: $page, limit: $limit) {
      mindmaps {
        _id
        title
        description
        originalMap
        currentMap
        mapimage
        editinghistory {
          editedMap
          updated
        }
      }
      currentPage
      totalPages
    }
  }
`;

export const GET_MINDMAP = gql`
  query GetMindmap($id: ID!) {
    getMindmap(_id: $id) {
      _id
      title
      description
      originalMap
      currentMap
      mapimage
      editinghistory {
        editedMap
        updated
      }
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
