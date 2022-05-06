import _ from 'lodash'
import mongoose from "mongoose"
import { ApolloError, } from 'apollo-server-express'

// import jwt from 'jsonwebtoken'
// import bcrypt from 'bcryptjs'
// import Joi from 'joi'

import User from '../../database/models/user.model.js'

import { issueTokens, checkSignedIn, getRefreshToken } from '../../../app/controllers/auth.js'
// import { registerUserValidator, loginUserValidator } from '../validators/user.validator.js'
// import { JWT_TOKEN_SECRET, JWT_TOKEN_EXPIRES_IN } from '../../../app/config/config.js'
//import AuthContext from '../../middleware/auth.js'
// const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET
// const JWT_TOKEN_EXPIRES_IN = process.env.JWT_TOKEN_EXPIRES_IN

const UserResolver = {
  Query: {
    getUsers: async (parent, args, { req }) => {

      //if (AuthContext(req)) { }
      const { search, page = 1, limit = 10 } = args;
      //console.log('args', args)
      //console.log('parent',parent)
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            //{ username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
          sortBy: UPDATEDAT_DESC
        };
      }

      const count = await User.countDocuments(searchQuery);
      if (!count) return {
        users: [],
        totalPages: 1,
        currentPage: 1,
        count: 0
      }

      const totalPages = Math.ceil(count / limit)
      const correctedPage = totalPages < page ? totalPages : page

      const users = await User.find(searchQuery)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((correctedPage - 1) * limit)
        .lean();

      return {
        users,
        totalPages: totalPages,
        currentPage: correctedPage,
        count
      }
    },
    getUser: async (parent, args, context) => {
      const { _id } = args;
      //console.log('getUser args,id', args, _id, context)
      //return await Users.findById(_id )
      const userRecord = await User.findById(_id);
      //console.log('getUser userRecord', userRecord)
      if (!userRecord) throw new ApolloError(`The user with the id ${_id} does not exist.`, 'USER_NOT_EXISTS_ERROR')
      return userRecord
    },
  },

  Mutation: {
    createUser: async (parent, { input: { firstName, lastName, date_of_birth, email, password } }, context) => {
      // In this case, we'll pretend there is no data when
      // we're not logged in. Another option would be to
      // throw an error.
      console.log('createUser context', context.user)
      //if (!context.user) return null;
      //await registerUserValidator.validateAsync({ firstName, lastName, date_of_birth, email, password }, { abortEarly: false })

      // Check if user exists already
      const existingUser = await User.findOne({ email })
      if (existingUser) throw new ApolloError('User with this email is exist', 'USER_EXISTS_ERROR')

      // Build new user
      const _id = new mongoose.Types.ObjectId();
      const newUser = new User({
        _id,
        firstName,
        lastName,
        date_of_birth,
        email: email.toLowerCase(),
        password,
      })

      // Create JSON webtoken
      const tokens = await issueTokens(newUser)
      newUser.token = tokens.refreshToken
      //console.log('created user tokens', tokens)
      // Store new User
      const res = await newUser.save()
      // console.log('created user res', res)
      // console.log('created user return', {
      //   id: res._id,
      //   ...res._doc,
      //   ...tokens
      // })
      return {
        user: res._doc,
        tokens
      }

      return new Promise((resolve, reject) => {
        newUser.save().then((user) => {
          resolve(user);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    // Protected routes
    deleteUser: async (parent, args, { req }, context, info) => {
      await checkSignedIn(req, true)
      const { _id } = args
      await User.findByIdAndDelete({ _id })
      return true
    },

    updateUser: async (parent, args, { req }, context, info) => {
      const { _id } = args
      const { firstName, lastName, date_of_birth } = args.input;
      // console.log('req', req)
      await checkSignedIn(req, true)
      const user = await User.findByIdAndUpdate(
        _id,
        { firstName, lastName, date_of_birth },
        { new: true }
      )
      return user
    },
  }
};

export default UserResolver