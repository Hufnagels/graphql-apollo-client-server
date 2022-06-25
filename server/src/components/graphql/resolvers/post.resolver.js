import _ from 'lodash'
import { ApolloError, } from 'apollo-server-express'

import Posts from '../../database/models/post.model.js'
import { issueTokens, checkSignedIn, getRefreshToken } from '../../../app/controllers/auth.js'

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
    // Protected routes
    createPost: async (parent, args, { req }, context, info) => {
      await checkSignedIn(req, true)
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
    
    updatePost: async (parent, args, { req }, context, info) => {
      await checkSignedIn(req, true)
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

    },
    
    deletePost: async (parent, args, { req }, context, info) => {
      await checkSignedIn(req, true)
      const { _id } = args

      Posts.findByIdAndDelete({ _id }, function (err, docs) {
        if (err) {
          console.log(err)
          return false
        }
        else {
          console.log("Deleted : ", docs);
          return true
        }
      })

    },
  }
};

export default PostResolver