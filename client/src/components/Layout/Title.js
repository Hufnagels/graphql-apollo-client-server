import React from 'react'

import {
  AppBar,
  Box,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';

const Title = props => {
  return (
    <Typography
      variant="h6"
      noWrap
      component="div"
      sx={{
        mr: 1,
        ml: 0,
        mt: 0,
        display: { xs: 'none', md: 'flex' },
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignContent: 'flex-start',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
      className="title--text"
    >
      {/* <img src={window.location.origin + "/android-icon-48x48.png"} style={{ margin: '0 10px' }} alt="" /> */}
      <Typography variant="h5" component="span" className="title--text" sx={{ fontSize: '2rem', fontWeight: '800', mt: -0.5 }}>{"{"}</Typography>
      {props.title}
      <Typography variant="h5" component="span" className="title--text" sx={{ fontSize: '2rem', fontWeight: '800', mt: -0.5 }}>{"}"}</Typography>
    </Typography>
  )
}

export default Title