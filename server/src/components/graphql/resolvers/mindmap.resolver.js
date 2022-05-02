import _ from 'lodash'
import { ApolloError, } from 'apollo-server-express'

import Mindmaps from '../../database/models/mindmap.model.js'

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
        .skip((page - 1) * limit)
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
    createMindmap: async (parent, args, context, info) => {
      //console.log('createMindmap args', args)
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

      return new Promise((resolve, reject) => {
        mindmap.save().then((res) => {
          resolve(mindmap);
        }).catch((err) => {
          reject(err);
        });
      });

    },
    deleteMindmap: async (parent, args, context, info) => {
      const { _id } = args
      await Mindmaps.findByIdAndDelete({ _id })
      return "OK"
    },
    updateMindmap: async (parent, args, context, info) => {
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