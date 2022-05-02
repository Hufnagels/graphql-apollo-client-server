import {
  gql
} from "@apollo/client";

// QUERIES
export const GET_POSTS = gql`
  query GetPosts($search: String, $page: Int, $limit: Int) {
    getPosts(search: $search, page: $page, limit: $limit) {
      posts {
        _id
        author
        title
        subtitle
        description
        titleimage
      }
      currentPage
      totalPages
    }
  }
`
export const GET_POST = gql`
  query GetPost($id: ID!) {
    getPost(_id: $id) {
      author
      title
      subtitle
      description
      titleimage
    }
  }
`

// MUTATIONS
export const CREATE_POST = gql`
  mutation CreatePost($input: PostInputCreate) {
    createPost(input: $input) {
      post {
        author
        title
        subtitle
        description
        titleimage
      }
      postErrors {
        message
        locations
        path
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: PostInputUpdate!) {
    updatePost(_id: $id, input: $input) {
      post {
        _id
        author
        title
        subtitle
        description
      }
      postErrors {
        message
        locations
        path
      }
    }
  }
`;

