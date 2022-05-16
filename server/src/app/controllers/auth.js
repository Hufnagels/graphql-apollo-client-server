import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-express'

import {
  JWT_TOKEN_SECRET,
  JWT_TOKEN_EXPIRES_IN,
  JWT_REFRESHTOKEN_SECRET,
  JWT_REFRESHTOKEN_EXPIRES_IN,
} from '../config/config.js'
import User from '../../components/database/models/user.model.js'

export const decodeToken = async (heaaderToken) => {
  try {
    const decodedToken = jwt.verify(heaaderToken, JWT_TOKEN_SECRET)
    //console.log('decodeToken', decodedToken)
    const { email, exp } = decodedToken
    return {
      email,
      exp
    }
  } catch (e) {
    //console.log('decodeToken error', e)
    throw new AuthenticationError('You must be logged in', 'UNAUTHENTICATED')
  }


}

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

export const checkSignedIn = async (req, requiredAuth = true) => {
//console.log('auth.js req.headers.authorization:', req.headers.authorization)
  const authHeader = req.headers.authorization
  if (process.env.NODE_ENV !== 'production') console.log('auth.js checkSignedIn', authHeader)
  if (authHeader) {
    const heaaderToken = authHeader.split(' ')[1]
    const { email, exp } = await decodeToken(heaaderToken)

    // if (Date.now() >= exp * 1000) {
    //   throw new AuthenticationError('Authentication failed', 'AUTHENTICATION_ERROR')
    // }

    const authUser = await User.findOne({ email })
    //console.log('auth.js token:', heaaderToken, decodedToken, authUser)
    if (!authUser) throw new AuthenticationError('Authentication failed', 'AUTHENTICATION_ERROR')
    if (requiredAuth) return authUser
  }
  return null
}

export const checkUserExist = async (authHeader, requiredAuth = false) => {
  //const authHeader = req.headers.authorization
//console.log('auth.js', authHeader)
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
  const authHeader = req.headers.authorization
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