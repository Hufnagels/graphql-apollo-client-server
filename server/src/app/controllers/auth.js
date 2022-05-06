import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-express'

import {
  JWT_TOKEN_SECRET,
  JWT_TOKEN_EXPIRES_IN,
  JWT_REFRESHTOKEN_SECRET,
  JWT_REFRESHTOKEN_EXPIRES_IN,
} from '../config/config.js'
import User from '../../components/database/models/user.model.js'

export const issueTokens = async ({ id, email, }) => {
  const accessToken = await jwt.sign(
    {
      id,
      email
    },
    JWT_TOKEN_SECRET,
    {
      expiresIn: parseInt(JWT_TOKEN_EXPIRES_IN)
    }
  )
  const refreshToken = await jwt.sign(
    {
      id,
      email
    },
    JWT_REFRESHTOKEN_SECRET,
    {
      expiresIn: JWT_REFRESHTOKEN_EXPIRES_IN
    }
  )

  return {
    accessToken,
    refreshToken
  }
}

export const checkSignedIn = async (req, requiredAuth = false) => {
  const authHeader = req.headers.authorization
  if (process.env.NODE_ENV !== 'production') console.log('auth.js checkSignedIn', authHeader)
  if (authHeader) {
    const heaaderToken = authHeader.split(' ')[1]
    const decodedToken = await jwt.verify(heaaderToken, JWT_TOKEN_SECRET)
    const authUser = await User.findById(decodedToken.id)
    //console.log('auth.js token:', heaaderToken, decodedToken, authUser)
    if (!authUser) throw new AuthenticationError('Authentication failed', 'AUTHENTICATION_ERROR')
    if (requiredAuth) return authUser
  }
  return null
}

export const checkUserExist = async (authHeader, requiredAuth = false) => {
  //const authHeader = req.headers.authorization
  if (process.env.NODE_ENV !== 'production') console.log('auth.js checkUserExist', authHeader)
  if (authHeader) {
    const heaaderToken = authHeader.split(' ')[1]
    const decodedToken = await jwt.verify(heaaderToken, JWT_TOKEN_SECRET)
    const authUser = await User.findById(decodedToken.id)
    //console.log('auth.js token:', heaaderToken, decodedToken, authUser)
    if (!authUser) throw new AuthenticationError('Authentication failed', 'AUTHENTICATION_ERROR')
    if (requiredAuth) return authUser
  }
  return null
}

export const getRefreshToken = async (req, requiredAuth = false) => {
  const authHeader = req.headers.refreshToken
  if (process.env.NODE_ENV !== 'production') console.log('auth.js getRefreshToken', authHeader)
  if (authHeader) {
    const heaaderToken = authHeader.split(' ')[1]
    const decodedToken = await jwt.verify(heaaderToken, JWT_REFRESHTOKEN_SECRET)
    const authUser = await User.findById(decodedToken.id)
    //console.log('auth.js token:', heaaderToken, decodedToken, authUser)
    if (!authUser) throw new AuthenticationError('Authentication failed', 'AUTHENTICATION_ERROR')
    if (requiredAuth) return authUser
    return null
  }
}