import * as React from 'react';
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

import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Title from './Title';

const TemporaryDrawer = props => {

  console.log('TemporaryDrawer props', props)
  /* const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  }); */

  /* const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  }; */

  const list = (anchor) => (
    <Box
      sx={{ width: props.anchor === 'top' || props.anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={props.toggleDrawer(props.anchor, false)}
      onKeyDown={props.toggleDrawer(props.anchor, false)}
    >
      <AppBar
        position="static"
        enableColorOnDark
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.custom3.light
              : theme.palette.custom3.dark,
        }}
      >
        <Toolbar sx={{ justifyContent: 'center'}} >
          <Title title={props.title} />
        </Toolbar>
      </AppBar>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
     {/*   {['left', 'right', 'top', 'bottom'].map((anchor) => (*/}
        <React.Fragment key={props.anchor}>
          {/* <Button onClick={props.toggleDrawer(props.anchor, true)}>{props.anchor}</Button> */}
          <Drawer
            anchor={props.anchor}
            open={props.open}
            onClose={props.toggleDrawer(props.anchor, false)}
          >
            {list(props.anchor)}
          </Drawer>
        </React.Fragment>
      {/* ))} */}
    </div>
  );
}

export default TemporaryDrawer
