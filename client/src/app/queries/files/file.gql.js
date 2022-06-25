import { gql } from "@apollo/client";

export const GET_FILES = gql`
  query GetFiles($search: String, $page: Int, $limit: Int) {
    getFiles(search: $search, page: $page, limit: $limit) {
      files {
        _id
        length
        chunkSize
        uploadDate
        filename
        contentType
        metadata {
          owner
          title
          description
          encoding
          thumbnail
        }
      }
      currentPage
      totalPages
      count
    }
  }
`

export const GET_FILE = gql`
  query GetFile($id: ID!) {
    getFile(_id: $id) {
      filename
      contentType
      uploadDate
      chunkSize
      length
      metadata {
        owner
        description
        title
        encoding
        thumbnail
        tags
      }
      file
    }
  }
`

export const UPLOAD_SINGLE_FILE = gql`
  mutation singleUpload($file: Upload!, $title: String!, $description: String) {
    singleUpload(file: $file, title: $title, description: $description) {
      path
      filename
      mimetype
      encoding
    }
  }
`
export const UPLOAD_MULTIPLE_FILES = gql`
  mutation MultipleUpload($files: [Upload!], $title: String!, $description: String, $tags: String) {
    multipleUpload(files: $files, title: $title, description: $description, tags: $tags) {
      message
    }
  }
`


export const DELETE_FILE = gql`
  mutation DeleteFile($id: ID!) {
    deleteFile(_id: $id)
  }
`