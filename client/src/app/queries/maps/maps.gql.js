import {
  gql
} from "@apollo/client";

export const GET_MAPS = gql`
  query GetMaps($search: String, $page: Int, $limit: Int) {
    getMaps(search: $search, page: $page, limit: $limit) {
      maps {
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

// MUTATIONS
export const CREATE_MAP = gql`
  mutation CreateMap($input: MapInputCreate!) {
    createMap(input: $input) {
      map {
        owner
        title
        description
        originalMap
        currentMap
        mapimage
      }
    }
  }
`;

export const DELETE_MAP = gql`
  mutation($id: ID!) {
    deleteMap(_id: $id)
  }
`