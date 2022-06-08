import {
  gql
} from "@apollo/client";

export const GET_MAPS = gql`
  query GetMaps($search: String, $page: Int, $limit: Int) {
    getMaps(search: $search, page: $page, limit: $limit) {
      maps {
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
        createdAt
        updatedAt
      }
      currentPage
      totalPages
    }
  }
`;

// MUTATIONS
export const CREATE_MAP = gql`
  mutation CreateMap($input: MapInputCreate!) {
    createMap(input: $input) {
      map {
        owner
        title
        description
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_MAP = gql`
  mutation($id: ID!) {
    deleteMMap(_id: $id)
  }
`