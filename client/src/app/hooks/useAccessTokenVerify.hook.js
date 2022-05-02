import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { useSelector } from 'react-redux'

import jwtDecode from 'jwt-decode';

/**
 * Custom hook
 * @param {logout function} token 
 * @returns 
 */

// if (localStorage.getItem('token')) {
//   const decodedToken = jwtDecode(localStorage.getItem('token'))
//   if (decodedToken.exp * 1000 < Date.now()) {
//     localStorage.removeItem('token')
//   } else {
//     initialState.user = decodedToken
//   }
// }

// const parseJwt = (token) => {
//   try {
//     return JSON.parse(atob(token.split(".")[1]));
//   } catch (e) {
//     return null;
//   }
// };

const useAccessTokenVerify = (props) => {

  const { user, tokens } = useSelector((state) => state.auth);

  props.history.listen(() => {
    //const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const decodedToken = jwtDecode((tokens.accessToken))
      if (decodedToken.exp * 1000 < Date.now()) {
        props.logOut();
      }
    }
  })

  return (<></>)
}

export default useAccessTokenVerify