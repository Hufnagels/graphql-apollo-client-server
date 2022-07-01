import _ from 'lodash'
import { ApolloError, UserInputError } from 'apollo-server-express'

import Tags from '../../database/models/tag.model.js'
import { issueTokens, checkSignedIn, getRefreshToken } from '../../../app/controllers/auth.js'

const TagResolver = {
  Query: {
    getTags: async (parent, args, context) => {
      // const user = await checkSignedIn(context.req, true)
      // const { email } = user
      //console.log('getTags', args, context)
      const email = 'kbvconsulting@gmail.com'
      const { search, page = 1, limit = 100 } = args;
      console.log('getTags search', search)
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $and: [
            { owner: { $regex: email, $options: 'i' } }
          ],
          $or: [
            { title: { $regex: search, $options: 'i' } },

          ]
        }
      } else {
        searchQuery = {
          $and: [
            { owner: { $regex: email, $options: 'i' } }
          ],
        }
      }
      //console.log('searchQuery', searchQuery)
      const count = await Tags.countDocuments(searchQuery)
      //console.log('count', count)
      if (!count) return {
        tags: [],
        totalPages: 0,
        currentPage: 0,
        count: 0
      }

      const totalPages = Math.ceil(count / limit)
      const correctedPage = totalPages < page ? totalPages : page

      const tags = await Tags.find(searchQuery)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((correctedPage - 1) * limit)
        .lean();

      return {
        tags: count > 0 ? tags : [],
        totalPages: totalPages,
        currentPage: correctedPage,
        count
      }
    },
    getTag: async (parent, args, context) => {
      const { _id } = args;
      const tagRecord = await Tags.findById(_id)
      if (!tagRecord) throw new UserInputError(`The tag with the id ${_id} does not exist.`)

      return tagRecord
    },
    findAll: async (parent, { cursor, limit, orderBy }, context) => {
      const { field, direction } = orderBy
      console.log('args:', cursor, limit, field, direction)
      // args: undefined 2 { direction: 'ASC', field: 'title' }
      const res = await Tags.find({})
        .sort({ field: direction === 'ASC' ? 1 : -1 })
        .limit(limit)
      console.log('result:', res)
      return {
        edges: {
          node: res._doc
        }
      }

    }
  },
  Mutation: {
    // Protected routes

  }
};

export default TagResolver