import React, { memo } from 'react';
import { useRoutes, } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from 'jwt-decode';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/react-hooks';

// Material
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Custom
import routes from './app/routes/routes'
import { logout, refreshtoken } from './app/reducers/authSlice'
import { REFRESH_TOKEN } from './app/queries/'

const App = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);

  const { isLoggedIn, user, tokens } = useSelector((state) => state.auth);
  // console.log('App js isLoggedIn, user, tokens',isLoggedIn, user, tokens)
  const page = useRoutes(routes(isLoggedIn));
  const dispatch = useDispatch()

  const [refreshToken] = useMutation(REFRESH_TOKEN, {
    onCompleted: ({ refreshToken }) => {
      // console.log('tokens', refreshToken)
      dispatch(refreshtoken(refreshToken));
      setOpen(false);
    },
    onError: (error) => {
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  })
  const handleOpenDialog = () => {
    // console.log('handleOpenDialog')
    setOpen(true);
  };
  const handleLogout = () => {
    // console.log('handleLogout')
    setOpen(false);
    dispatch(logout());
  };
  const handleStay = () => {
    // console.log('handleStay')
    refreshToken({
      variables: {
        input: {
          "email": user.email,
          "_id": user._id,
        }
      }
    })
  };

  //console.log('App user'/* , user, tokens */);

  if (user && !open) {
    const decodedToken = jwtDecode((tokens.accessToken))
    //console.log('App user decodedToken', decodedToken, Date.now() - decodedToken.exp * 1000);
    if (decodedToken.exp * 1000 < Date.now()) {
      //console.log('decodedToken expired')
      handleOpenDialog()
    }
  }

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
          <DialogContentText id="alert-dialog-description">Do you want to STAY or Sign Out?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStay} autoFocus>Stay</Button>
          <Button onClick={handleLogout} >Sign out</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default memo(App)