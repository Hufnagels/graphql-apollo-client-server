/* import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';
import { useSelector, useDispatch } from 'react-redux'
import { login, logout } from '../reducers/authSlice'

let initialState = {
  user: {},
  isLoggedIn: false,
  tokens: {
    accessToken: '',
    refreshToken: '',
  }
}

if (localStorage.getItem('token')) {
  const decodedToken = jwtDecode(localStorage.getItem('token'))
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('token')
  } else {
    initialState.user = decodedToken
  }
}

const authContext = createContext({
  user: null,
  login: (userData, tokens) => { },
  logout: () => { },
})

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
console.log('AuthContext LOGIN:', action.payload)
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      }
    default:
      return state
  }
}

const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = (userData, tokens) => {
    localStorage.setItem('token', tokens.accessToken)
console.log('AuthContext login', userData, tokens)
    dispatch({
      type: "LOGIN",
      payload: { user: userData, tokens }
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({
      type: 'LOGOUT'
    })
  }

  return (
    <authContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  )
}

export {
  authContext, AuthProvider
} */