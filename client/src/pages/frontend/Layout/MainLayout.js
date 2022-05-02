import React, { useContext } from 'react';
import { useSelector } from 'react-redux'

// Custom
import HeaderResponsiveAppBar from '../../../components/Layout/AppBar'
import Main from './Main'
import StickyFooter from '../../../components/Layout/Footer'
//import { authContext } from '../../../app/context/authContext'

const MainLayout = () => {
  //const { user } = useContext(authContext)
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const pages = [
    { name: 'Home', link: '/' },
    { name: 'Blog', link: '/blog' },
  ];
  const settings = user === null ? [
    { name: 'SignIn', link: '/signin' },
    { name: 'SignUp', link: '/signup' },
  ] : [
    { name: 'Dashboard', link: '/app' },
  ]
  return (
    <React.Fragment>
      <HeaderResponsiveAppBar title={process.env.REACT_APP_WEBSITE_NAME} pages={pages} settings={settings} />
      <Main />
      <StickyFooter />
    </React.Fragment>
  )
}

export default MainLayout