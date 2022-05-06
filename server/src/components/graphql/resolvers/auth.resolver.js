import _ from 'lodash'
import { ApolloError, } from 'apollo-server-express'
import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import mongoose from "mongoose"
// import Joi from 'joi'

import User from '../../database/models/user.model.js'
import { issueTokens, checkSignedIn, getRefreshToken } from '../../../app/controllers/auth.js'
// import { registerUserValidator, loginUserValidator } from '../validators/user.validator.js'
// import { JWT_TOKEN_SECRET, JWT_TOKEN_EXPIRES_IN } from '../../../app/config/config.js'
//import AuthContext from '../../middleware/auth.js'
// const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET
// const JWT_TOKEN_EXPIRES_IN = process.env.JWT_TOKEN_EXPIRES_IN

const AuthResolver = {
  Query: {},

  Mutation: {
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
      console.log('Auth resolver tokens', user, returnedUser, tokens)
      return {
        user:returnedUser,
        tokens
      }
      // const token = jwt.sign(
      //   {
      //     id: user._id,
      //     email
      //   },
      //   JWT_TOKEN_SECRET, //JWT_TOKEN_SECRET,
      //   {
      //     expiresIn: JWT_TOKEN_EXPIRES_IN
      //   }
      // )
      user.token = tokens.accessToken
      return {
        id: user._id,
        ...user._doc
      }
    },
    refreshToken: async (parent, args, { req }, context) => {
      const authUser = await getRefreshToken(req, true)
      const tokens = await issueTokens(authUser)
      return {
        user: authUser,
        ...tokens
      }
    },
  }
};

export default AuthResolver