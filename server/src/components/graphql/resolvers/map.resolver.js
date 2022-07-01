import _ from 'lodash'
import { ApolloError, UserInputError } from 'apollo-server-express'

import Maps from '../../database/models/map.model.js'
import { issueTokens, checkSignedIn, getRefreshToken } from '../../../app/controllers/auth.js'

const MapResolver = {
  Query: {
    // Maps
    getMaps: async (parent, args) => {
      const { search, page = 1, limit = 10 } = args;
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      }

      const count = await Maps.countDocuments(searchQuery);
      if (!count) return {
        maps: [],
        totalPages: 0,
        currentPage: 0,
        count: 0
      }

      const totalPages = Math.ceil(count / limit)
      const correctedPage = totalPages < page ? totalPages : page

      const maps = await Maps.find(searchQuery)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((correctedPage - 1) * limit)
        .lean();

      return {
        maps: count > 0 ? maps : [],
        totalPages: totalPages,
        currentPage: correctedPage,
        count
      }
    },
    getMap: async (parent, args) => {
      const { _id } = args;
      const mapRecord = await Maps.findById(_id)
      if (!mapRecord) throw new Error(`The map with the id ${_id} does not exist.`)

      return mapRecord
    },
  },
  Mutation: {
    // Protected routes
    createMap: async (parent, args, { req }, context, info) => {
      await checkSignedIn(req, true)
      console.log('createMap args', args.input)
      //console.log('createMap context', context.user)

      const { owner, title, description, originalMap, currentMap, mapimage } = args.input;

      const map = new Maps({
        owner,
        title,
        description,
        originalMap,
        currentMap,
        mapimage
      })
      //throw new UserInputError('Teszt')
      const res = await map.save()
      return {
        map: res._doc,
      }

    },
    deleteMap: async (parent, args, { req }, context, info) => {
      await checkSignedIn(req, true)
      const { _id } = args
      Maps.findByIdAndDelete({ _id }, function (err, docs) {
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
    updateMap: async (parent, args, { req }, context, info) => {
      await checkSignedIn(req, true)
      const { _id } = args
      const { title, description, currentMap, mapimage, editinghistory } = args.input;

      const map = await Maps.findByIdAndUpdate(
        _id,
        { title, description, currentMap, mapimage, editinghistory },
        { new: true }
      )
      return map
    }
  }
};

export default MapResolver