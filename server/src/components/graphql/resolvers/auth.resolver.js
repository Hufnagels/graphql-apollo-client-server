import _ from 'lodash'
import mongoose from "mongoose"
import { ApolloError, } from 'apollo-server-express'
import bcrypt from 'bcryptjs'

import User from '../../database/models/user.model.js'
import { issueTokens, checkSignedIn, getRefreshToken } from '../../../app/controllers/auth.js'

const AuthResolver = {
  Query: {},

  Mutation: {
    signupUser: async (parent, { input: { firstName, lastName, date_of_birth, email, password } }, { req }, context) => {
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
      return true

      return new Promise((resolve, reject) => {
        newUser.save().then((user) => {
          resolve(user);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    loginUser: async (parent, { input: { email, password } }) => {
      // check credentials
      //await loginUserValidator.validateAsync({ email, password }, { abortEarly: false })

      const user = await User.findOne({ email })
      if (!user) throw new ApolloError('User with this credentials does not exists', 'USER_NOT_EXISTS_ERROR')

      // Password checking
      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) throw new ApolloError('User with this credentials does not exists', 'USER_INCORRECT_PASSWORD_ERROR')

      // Create JSON webtoken
      const tokens = await issueTokens(user)
      user.token = tokens.accessToken
      const returnedUser = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: tokens.accessToken,
      }
      //console.log('Auth resolver tokens', user, returnedUser, tokens)
      return {
        user: returnedUser,
        tokens
      }
    },

    refreshToken: async (parent, { input: { _id, email, } }, context) => {
      //console.log('refreshToken context', _id, email) //, context.req.authorization)
      //return null
      //const authUser = await getRefreshToken(req, true)
      const tokens = await issueTokens({ _id, email, })
      //console.log('refreshToken tokens', tokens)
      return {
        tokens
      }
    },
  }
};

export default AuthResolver