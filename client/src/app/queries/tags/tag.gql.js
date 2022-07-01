import { gql } from "@apollo/client";

export const GET_TAGS = gql`
  query GetTaags($search: String, $page: Int, $limit: Int) {
    getTags(search: $search, page: $page, limit: $limit) {
      tags {
        title
        _id
        owner
        createdAt
      }
      currentPage
      totalPages
      count
    }
  }
`