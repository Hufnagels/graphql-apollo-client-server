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
      }
      currentPage
      totalPages
    }
  }
`;
