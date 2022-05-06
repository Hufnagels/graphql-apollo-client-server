import React, { useContext, } from 'react';
import { useFormik, } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// Material
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  IconButton,
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  Link,
  Paper,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Custom
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../app/queries";
//import { authContext } from "../../app/context/authContext"
import { login } from '../../app/reducers/authSlice'

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

const SignInSide = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  //const context = useContext(authContext)
  const [loginUser, { error }] = useMutation(LOGIN_USER, {
    variables: {
      input: {
        "email": '',
        "password": '',
      }
    },
    onCompleted: ({ loginUser }) => {
      console.log('loginUser', loginUser)
      localStorage.setItem('token', loginUser.tokens.accessToken);
      dispatch(login(loginUser))
      navigate('/app');
    },
    onError: (error) => {
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  });
  const { enqueueSnackbar } = useSnackbar();
  const [values, setValues] = React.useState({
    email: '',
    password: '',
    showPassword: false,
  });
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const formik = useFormik({
    initialValues: {
      "email": '',
      "password": '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      loginUser(
        {
          variables: { input: values }
        },
      )/* .then((res) => {
        console.log('loginUser promise', res.data.loginUser)
        //context.login(res.data.loginUser.user, res.data.loginUser.tokens)
        dispatch(login(res.data.loginUser))
        //const variant = 'success'
        //enqueueSnackbar('User created successfully', { variant })
        navigate('/')
        //console.log('loginUser setUsers')
      }).catch((err) => {
        //console.log('loginUser catch err', err.message)
        const variant = 'error'
        enqueueSnackbar(err.message, { variant })
      }) */
    },
  })

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get('email'),
  //     password: data.get('password'),
  //   });
  // };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.info.light
              : theme.palette.info.dark,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            {/* component="form" noValidate onSubmit={handleSubmit} */}
            <Box sx={{ mt: 1 }}>
              <TextField
                fullWidth
                autoFocus
                margin="dense"
                id="email"
                name="email"
                label="Email Address"
                type="email"
                autoComplete="on"
                variant="standard"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <FormControl sx={{ my: 1, /* width: '25ch' */ }} fullWidth variant="standard">
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  name="password"
                  label="Password"
                  type={values.showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  /* helperText={formik.touched.password && formik.errors.password} */
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              {/*<TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                variant="standard"

                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
               <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3, mb: 2, backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.info.light
                      : theme.palette.info.dark,
                }}
              >
                Sign In
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">Forgot password?</Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">{"Don't have an account? Sign Up"}</Link>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}

export default SignInSide