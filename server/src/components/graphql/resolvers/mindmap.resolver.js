import _ from 'lodash'
import { ApolloError, } from 'apollo-server-express'

import Mindmaps from '../../database/models/mindmap.model.js'
import { issueTokens, checkSignedIn, getRefreshToken } from '../../../app/controllers/auth.js'

const MindmapResolver = {
  Query: {
    // Maps
    getMindmaps: async (parent, args) => {
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

      const count = await Mindmaps.countDocuments(searchQuery);
      const totalPages = Math.ceil(count / limit)
      const correctedPage = totalPages < page ? totalPages : page

      const mindmaps = await Mindmaps.find(searchQuery)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((correctedPage - 1) * limit)
        .lean();

      return {
        mindmaps,
        totalPages: totalPages,
        currentPage: correctedPage
      }
    },
    getMindmap: async (parent, args) => {
      const { _id } = args;
      const mindmapRecord = await Mindmaps.findById(_id)
      if (!mindmapRecord) throw new Error(`The mindmap with the id ${_id} does not exist.`)

      return mindmapRecord
    },
  },
  Mutation: {
    // Protected routes
    createMindmap: async (parent, args, { req }, context, info) => {
      await checkSignedIn(req, true)
      const { owner, title, description, originalMap, currentMap, mapimage } = args.input;
      let error = {}

      const mindmap = new Mindmaps({
        owner,
        title,
        description,
        originalMap,
        currentMap,
        mapimage
      })

      const res = await mindmap.save()
      return {
        mindmap: res._doc,
      }

    },
    deleteMindmap: async (parent, args, { req }, context, info) => {
      await checkSignedIn(req, true)
      const { _id } = args
      Mindmaps.findByIdAndDelete({ _id }, function (err, docs) {
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
    updateMindmap: async (parent, args, { req }, context, info) => {
      await checkSignedIn(req, true)
      const { _id } = args
      const { title, description, currentMap, mapimage, editinghistory } = args.input;

      const mindmap = await Mindmaps.findByIdAndUpdate(
        _id,
        { title, description, currentMap, mapimage, editinghistory },
        { new: true }
      )
      return mindmap
    }
  }
};

export default MindmapResolver