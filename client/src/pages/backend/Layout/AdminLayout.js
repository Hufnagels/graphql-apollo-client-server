import React from 'react'

// Material
import {
  Box,
  Drawer,
} from '@mui/material';

// Custom
//import Header from './Header'
import HeaderResponsiveAppBar from '../../../components/Layout/AppBar'
import TemporaryDrawer from '../../../components/Layout/TemporaryDrawer';
import Main from './Main'
import { FOCUSABLE_SELECTOR } from '@testing-library/user-event/dist/utils';

const AdminLayout = () => {
  const pages = [
    { name: 'Users', link: '/app/users' },
    { name: 'Courses', link: '/app/courses' },
    { name: 'Maps', link: '/app/maps' },
    { name: 'MindMaps', link: '/app/mindmaps' },
    { name: 'Whiteboards', link: '/app/whiteboards' },
    { name: 'Blogs', link: '/app/blogs' },
    { name: 'Uploads', link: '/app/uploads' },
    { name: 'Chat', link: '/app/chat' },

  ];
  const settings = [
    { name: 'Profile', link: '/app/user/profile' },
    { name: 'Account', link: '/app/user/profile' },
    { name: 'Home', link: '/' },
  ]

  // TemporaryDrawer
  const anchor = 'left'
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const toggleDrawer = (anchor, open) => (event) => {
    // console.log('toggleDrawer', anchor, open, event)
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  return (
    <React.Fragment>
      <HeaderResponsiveAppBar
        title={'GQL react' || process.env.REACT_APP_WEBSITE_NAME}
        pages={pages}
        settings={settings}
        toggler={toggleDrawer}
      />

      <Main />

      <TemporaryDrawer
        title={'GQL react' || process.env.REACT_APP_WEBSITE_NAME}
        toggleDrawer={toggleDrawer}
        anchor={anchor}
        open={state[anchor]}
      />
      {/* <Drawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}
      >
        <Box
          sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >

        </Box>
      </Drawer> */}
    </React.Fragment>
  )
}

export default AdminLayout