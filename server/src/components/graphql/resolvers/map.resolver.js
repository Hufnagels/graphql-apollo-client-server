import _ from 'lodash'
import { ApolloError, } from 'apollo-server-express'

import Maps from '../../database/models/map.model.js'

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
        .skip((page - 1) * limit)
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
    createMap: async (parent, args, context, info) => {
      //console.log('add post args', args)
      const { owner, title, description, originalMap, currentMap, mapimage } = args.input;
      let error = {}

      const map = new Maps({
        owner,
        title,
        description,
        originalMap,
        currentMap,
        mapimage
      })

      return new Promise((resolve, reject) => {
        map.save().then((map) => {
          resolve(user);
        }).catch((err) => {
          reject(err);
        });
      });

    },
    deleteMap: async (parent, args, context, info) => {
      const { _id } = args
      await Maps.findByIdAndDelete({ _id })
      return "OK"
    },
    updateMap: async (parent, args, context, info) => {
      const { _id } = args
      const { author, title, description, titleimage } = args.post;

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