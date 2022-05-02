import React, { memo } from 'react';
import { useRoutes, } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from 'jwt-decode';
import { useSnackbar } from 'notistack';

// Material
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Custom
import routes from './app/routes/routes'
import { logout } from './app/reducers/authSlice'


const App = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);

  const { isLoggedIn, user, tokens } = useSelector((state) => state.auth);

  const page = useRoutes(routes(isLoggedIn));
  const dispatch = useDispatch()

  const handleOpenDialog = () => {
    console.log('handleOpenDialog')
    setOpen(true);
  };
  const handleLogout = () => {
    console.log('handleLogout')
    setOpen(false);
    dispatch(logout());
  };
  const handleStay = () => {
    console.log('handleLogout')
    setOpen(false);
    dispatch(logout());
  };

  console.log('App user'/* , user, tokens */);

  if (user && !open) {
    const decodedToken = jwtDecode((tokens.accessToken))
    //console.log('App user decodedToken', decodedToken, Date.now() - decodedToken.exp * 1000);
    if (decodedToken.exp * 1000 < Date.now()) {
      console.log('decodedToken expired')
      handleOpenDialog()
    }
  }


  React.useLayoutEffect(() => {
    console.log("App.js->useLayoutEffect"/* , user */);
    if (!open) return
    const variant = 'error'
    enqueueSnackbar('Token expired', { variant })
  }, [open]);

  return (
    <React.Fragment>
      {!open && page}
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleLogout();
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Your session has been ended"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to STAY or Sign Out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStay}>Stay</Button>
          <Button onClick={handleLogout} autoFocus>Sign out</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default memo(App)