import jwt from 'jsonwebtoken'
import { AuthenticationError, ApolloError } from 'apollo-server-express'

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

export const decodeToken = async (heaaderToken) => {
  try {
    const decodedToken = jwt.verify(heaaderToken, JWT_TOKEN_SECRET)
    console.log('#2/A decodeToken', decodedToken)
    const { id, email, iat, exp } = decodedToken
    return {
      id,
      email,
      iat,
      exp
    }
  } catch (error) {
    console.log('#2/B decodeToken error', error.message)
    return false
    throw new ApolloError('You must be logged in', 'UNAUTHENTICATED')
  }
}

export const checkSignedIn = async (req, requiredAuth = true) => {
  //console.log('auth.js req.headers.authorization:', req.headers.authorization)
  //throw new AuthenticationError('Authentication failed', 'AUTHENTICATION_ERROR')
  const authHeader = req.headers.authorization
  if (process.env.NODE_ENV !== 'production') console.log('#1 auth.js checkSignedIn', authHeader)

  if (authHeader) {
    const heaaderToken = authHeader.split(' ')[1]
    try {
      const jwtResponse = await decodeToken(heaaderToken)
      console.log('#2/C jwtResponse', jwtResponse)
      const { email, iat, exp } = jwtResponse
      const authUser = await User.findOne({ email })
      if (!authUser) throw new AuthenticationError('Authentication failed', 'AUTHENTICATION_ERROR')
      if (requiredAuth) return authUser
    } catch (e) {
      console.log('#3 checkSignedIn error', e.message)
      throw new ApolloError('You must be logged in', 'UNAUTHENTICATED')
      return null
    }
    // const jwtResponse = await decodeToken(heaaderToken)
    // if (jwtResponse) {
    //   const { email, iat, exp } = jwtResponse
    //   const authUser = await User.findOne({ email })
    //   //console.log('auth.js token:', heaaderToken, decodedToken, authUser)
    //   if (!authUser) throw new AuthenticationError('Authentication failed', 'AUTHENTICATION_ERROR')
    //   if (requiredAuth) return authUser
    //   console.log('#3 checkSignedIn exp', jwtResponse)
    // } else
    //   return null
    //throw new AuthenticationError('You must be logged in', 'UNAUTHENTICATED')
  }
  console.log('auth.js checkSignedIn authHeader:', authHeader)
  throw new AuthenticationError('You must be logged in', 'UNAUTHENTICATED')
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