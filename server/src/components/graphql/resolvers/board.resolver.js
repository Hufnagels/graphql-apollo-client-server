import _ from 'lodash'
import { ApolloError, } from 'apollo-server-express'
import { PubSub } from 'graphql-subscriptions';

import { issueTokens, checkSignedIn, getRefreshToken } from '../../../app/controllers/auth.js'
import Boards from '../../database/models/board.model.js'

const pubsub = new PubSub();
const elements = [];
const subscribers = [];
const onElementAdded = (fn) => subscribers.push(fn);

const BoardResolver = {
  Query: {
    // Boards
    getBoards: async (parent, args, context, info) => {
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

      const count = await Boards.countDocuments(searchQuery);
      if (!count) return {
        boards: [],
        totalPages: 0,
        currentPage: 0,
        count: 0
      }

      const totalPages = Math.ceil(count / limit)
      const correctedPage = totalPages < page ? totalPages : page

      const boards = await Boards.find(searchQuery)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      return {
        boards: count > 0 ? boards : [],
        totalPages: totalPages,
        currentPage: correctedPage,
        count
      }
    },
    getBoard: async (parent, args) => {
      const { _id } = args;
      const boardRecord = await Boards.findById(_id)
      if (!boardRecord) throw new Error(`The Board with the id ${_id} does not exist.`)

      return boardRecord
    },
    // Subscription part of Query
    elements: () => elements,
  },
  Mutation: {
    // Protected routes
    createBoard: async (parent, args, { req }, context, info) => {
      await checkSignedIn(req, true)
      const { owner, title, description } = args.input;
      console.log('createBoard', args.input)
      const newBoard = new Boards({
        owner,
        title,
        description,
      })

      const res = await newBoard.save()
      return {
        board: res._doc,
      }

    },
    deleteBoard: async (parent, args, { req }, context, info) => {
      await checkSignedIn(req, true)
      const { _id } = args
      Boards.findByIdAndDelete({ _id }, function (err, docs) {
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
    updateBoard: async (parent, args, { req }, context, info) => {
      await checkSignedIn(req, true)
      console.log('Whiteboard updateBoard after checkSignedIn')
      const { _id } = args
      const { owner, title, description, board, boardimage } = args.input;

      const map = await Boards.findByIdAndUpdate(
        _id,
        { owner, title, description, board, boardimage },
        { new: true }
      )
      return map
    },
    // Subscription part of Mutation
    postUpdatedElement: async (parent, { boardid, elementid, type, action, params }, { req }) => {
      //console.log('Whiteboard postUpdatedElement req.headers', req.headers)
      await checkSignedIn(req, true)
      console.log('Whiteboard postUpdatedElement after checkSignedIn')
      const idx = elements.length;
      elements.push({
        boardid,
        elementid,
        type,
        action,
        params,
      });
      subscribers.forEach((fn) => fn());
      return idx;
    },
  },
  Subscription: {
    elements: {
      subscribe: (parent, { req }, args, context) => {
        //console.log('Subscription subscribe', parent, args, { req }, context)
        const channel = Math.random().toString(36).slice(2, 15); // 'Whiteboard_test'//
        onElementAdded(() => pubsub.publish(channel, { elements }))
        setTimeout(() => pubsub.publish(channel, { elements }), 0)
        return pubsub.asyncIterator(channel)
      },
    },
  },
};

export default BoardResolver