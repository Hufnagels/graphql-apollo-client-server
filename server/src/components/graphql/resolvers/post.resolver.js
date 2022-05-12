import _ from 'lodash'
import { ApolloError, } from 'apollo-server-express'

import Posts from '../../database/models/post.model.js'

const PostResolver = {
  Query: {
    // Posts
    getPosts: async (parent, args) => {
      const { search, page = 1, limit = 10 } = args;
      //console.log(args)
      let searchQuery = {};
      if (search) {
        // update the search query
        searchQuery = {
          $or: [
            { author: { $regex: search, $options: 'i' } },
            { title: { $regex: search, $options: 'i' } },
            { subtitle: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ]
        };
      }

      const count = await Posts.countDocuments(searchQuery);
      if (!count) return {
        posts: [],
        totalPages: 1,
        currentPage: 1,
        count: 0
      }

      const totalPages = Math.ceil(count / limit)
      const correctedPage = totalPages < page ? totalPages : page

      const posts = await Posts.find(searchQuery)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((correctedPage - 1) * limit)
        .lean();

      return {
        posts,
        totalPages: totalPages,
        currentPage: correctedPage,
        count
      }
    },
    getPost: async (parent, args) => {
      const { _id } = args;
      const postRecord = await Posts.findById(_id)
      if (!postRecord) throw new Error(`The post with the id ${_id} does not exist.`)

      return postRecord
    },
  },
  Mutation: {
    createPost: async (parent, args, context, info) => {
      //console.log('add post args', args)
      const { author, title, subtitle, description, titleimage } = args.input;
      let error = {}
      //console.log('create post', author, title, subtitle, description, titleimage)
      const post = new Posts({
        author,
        title,
        subtitle,
        description,
        titleimage
      })
      //console.log('create post Post', post)
      const res = await post.save()
      return {
        post: res._doc,
      }
    },
    deletePost: async (parent, args, context, info) => {
      const { _id } = args
      // deleteOne()
      // deletePost res { acknowledged: true, deletedCount: 0 }
      // deletePost post [ { acknowledged: true, deletedCount: 0 } ]
      // findByIdAndDelete()
      // deletePost res null
      // deletePost post [ null ]
      /**
       * return object if _id exist
       {
        "data": {
          "deletePost": {
            "postErrors": null,
            "post": true || false
          }
        }
      }
      * return object if _id doesn't exists
      {
        "errors": [
          {
            "message": "The post with the given data \"{ _id: '62534e4c5b7ce8dd0b61ee021' }\" does not exist.",
          }
        ],
        "data": {
          "deletePost": null
        }
      }
      */
      const post = await Posts.findByIdAndDelete({ _id })
        .then(res => {
          //console.log('deletePost res', res)
          if (res === null) return false
          return true
        })
        .catch(err => {
          //console.log('err', JSON.stringify(err))
          throw new ApolloError(`The post with the given data ${_.toString(err.stringValue)} does not exist.`)
        })
      //console.log('deletePost post', post)
      return { post }

    },
    updatePost: async (parent, args, context, info) => {
      const { _id } = args
      const { title, subtitle, description, titleimage } = args.input;
      //console.log('updatePost args', args)

      const post = await Posts.findByIdAndUpdate(
        _id,
        { title, subtitle, description, titleimage },
        { new: true }
      )
        .then(res => {
          //console.log('updatePost res', res)
          return [res]
        })
        .catch(err => {
          //console.log('err', _.toString(err.stringValue), JSON.stringify(err))
          throw new ApolloError(`The post with the given data ${_.toString(err.stringValue)} does not exist.`)
        })
      //console.log('updatePost post', post)
      return { post }

    }
  }
};

export default PostResolver