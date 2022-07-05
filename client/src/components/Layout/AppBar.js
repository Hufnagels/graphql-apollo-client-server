import React, { useEffect, memo, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

// Material
import {
  Avatar,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Divider,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// Custom
import Title from "./Title";
//import { authContext } from '../../app/context/authContext'
import { logout } from '../../app/reducers/authSlice'

const HeaderResponsiveAppBar = (props) => {

  //const context = useContext(authContext)
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    //context.logout()
    dispatch(logout())
    navigate('/')
  }
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  useEffect(() => {
    // console.log("HeaderResponsiveAppBar.js->useEffect");
  }, []);

  return (
    <React.Fragment>
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
        {/* <Container maxWidth="xl"> */}
        <Toolbar /* variant="dense" */ disableGutters={props.toggler ? true : false}>
          {/*
            Desktop title
            */}
          {props.toggler && <IconButton onClick={props.toggler('left', true)} >
            <KeyboardArrowRightIcon
              fontSize="large"
              sx={{
                color: (theme) => theme.palette.mode === 'dark'
                  ? theme.palette.custom.light
                  : theme.palette.custom.light,
              }}
            />
          </IconButton>}
          <Title title={'GQL react' || props.title} />
          {/* 
            Desktop menu
             */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {props.pages && props.pages.map((page, idx) => (
              <NavLink to={page.link} key={idx}>
                {({ isActive }) => (
                  <Button
                    className={isActive ? 'active-button link-button' : 'link-button'}
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    sx={{ color: 'white', display: 'block' }}
                    variant={isActive ? 'contained' : 'text'}
                  >
                    {page.name}
                  </Button>
                )}
              </NavLink>
            ))}

          </Box>

          {/* 
            Mobile menu
             */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, }}>
            <IconButton
              fontSize="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="secondary"
            >
              <MenuIcon fontSize="large" />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },

              }}
            >
              {props.pages && props.pages.map((page, idx) => (
                <NavLink to={page.link} key={idx} end>
                  {({ isActive }) => (
                    <Button
                      key={page.name}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, display: 'block', color: '#333' }}
                      variant={isActive ? 'outlined' : 'text'}
                    >
                      {page.name}
                    </Button>
                  )}
                </NavLink>
              ))}
            </Menu>
          </Box>
          {/* 
            Mobile title
             */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            {props.title}
          </Typography>
          {/* 
            User menu
             */}

          {props.settings && <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} >
                <MoreIcon
                  fontSize="large"
                  sx={{
                    color: (theme) => theme.palette.mode === 'dark'
                      ? theme.palette.custom.light
                      : theme.palette.custom.light,
                  }}
                /> {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {props.settings.map((setting, idx) => (
                <NavLink to={setting.link} key={idx} end>
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                </NavLink>
              )
              )}
              {user && <Divider orientation="horizontal" />}
              {user &&
                <NavLink to={'/'} key={'logout'} end>
                  <MenuItem key={'logoutLink'} onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </NavLink>
              }
            </Menu>
          </Box>}
        </Toolbar>
        {/* </Container> */}
      </AppBar>
    </React.Fragment>
  );
};

export default memo(HeaderResponsiveAppBar);