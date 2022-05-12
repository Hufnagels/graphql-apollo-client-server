import React from 'react'

//import Header from './Header'
import HeaderResponsiveAppBar from '../../../components/Layout/AppBar'
import Main from './Main'

const AdminLayout = () => {
  const pages = [
    { name: 'Users', link: '/app/users' },
    { name: 'Courses', link: '/app/courses' },
    { name: 'Maps', link: '/app/maps' },
    { name: 'MindMaps', link: '/app/mindmaps' },
    { name: 'Blogs', link: '/app/blogs' },
    { name: 'Chat', link: '/app/chat' },
    { name: 'Home', link: '/' },
  ];
  const settings = [
    { name: 'Profile', link: '/app/user/profile' },
    { name: 'Account', link: '/app/user/profile' },
  ];

  return (
    <React.Fragment>
      <HeaderResponsiveAppBar title={process.env.REACT_APP_WEBSITE_NAME} pages={pages} settings={settings} />
      <Main />
    </React.Fragment>
  )
}

export default AdminLayout