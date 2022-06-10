import React from 'react'
import { useFormik, } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import { useLocation } from "react-router-dom"

// Material
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import MobileDatePicker from '@mui/lab/MobileDatePicker';

// Custom
import {
  useMutation
} from "@apollo/client";
import { CREATE_USER } from "../../app/queries";
import { makePageTitleFromPath } from '../../app/functions/text'

const validationSchema = yup.object({
  firstName: yup
    .string('Enter your First name')
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastName: yup
    .string('Enter your Last name')
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  date_of_birth: yup
    .date()
    .nullable(),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  passwordConfirmation: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});

const Add = ({ onClick, active, refetch, users, setUsers }) => {

  const location = useLocation();
  const [title, setTitle] = React.useState(makePageTitleFromPath(location.pathname))

  const { enqueueSnackbar } = useSnackbar();

  const [dateOfBirth, setDateOfBirth] = React.useState(new Date())
  const [open, setOpen] = React.useState(active);

  const [createUser, { error }] = useMutation(CREATE_USER, {
    onCompleted: ({ createUser }) => {

      const variant = 'success'
      enqueueSnackbar(title + ' created successfully', { variant })
      onClick(false)
      setOpen(false)
      // console.log('createUser setUsers', users)
      refetch();
    },
    onError: (error) => {
      // console.log('CREATE_USER error', error)
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  });

  const formik = useFormik({
    initialValues: {
      // "username": '',
      "firstName": 'Varkonyi',
      "lastName": 'Istvan',
      "date_of_birth": '',
      "email": 'kbvconsulting@gmail.com',
      "password": 'asasasas',
      "passwordConfirmation": 'asasasas',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      values.date_of_birth = dateOfBirth.toISOString()
      const newData = _.omit(values, 'passwordConfirmation')
      createUser({ variables: { input: newData } })
    },
  })

  /* const handleClickOpen = () => {
    setOpen(true);
  }; */

  const handleClose = () => {

    onClick(false)
    formik.resetForm()
    setOpen(false);
  };

  React.useEffect(() => {
    setOpen(active)
  }, [active])

  return (
    <div>
      {error && error.graphQLErrors && <pre>
        {JSON.stringify(error.graphQLErrors.message, null, 2)}
      </pre>}
      <Dialog
        fullWidth
        maxWidth={'md'}
        keepMounted
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle id="draggable-dialog-title">Add new {title}</DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText>
              Please, fill form below to add new {title}
            </DialogContentText>
            <TextField
              fullWidth
              autoFocus
              margin="dense"
              type="text"
              variant="standard"
              id="lastName"
              name="lastName"
              label="Last name"

              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
            <TextField
              fullWidth
              autoFocus
              margin="dense"
              type="text"
              variant="standard"
              id="firstName"
              name="firstName"
              label="First name"

              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
            />
            <TextField
              fullWidth
              autoFocus
              margin="dense"
              type="email"
              variant="standard"
              id="email"
              name="email"
              label="Email Address"

              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <MobileDatePicker

              label="Date of birth"
              value={dateOfBirth}
              minDate={new Date('1940-01-01')}
              maxDate={new Date()}
              format="yyyy/MM/dd"
              onChange={(newValue) => {
                setDateOfBirth(newValue)
                //formik.handleChange(newValue)
              }}
              renderInput={(params) =>
                <TextField
                  id="date_of_birth"
                  name="date_of_birth"
                  margin="dense"
                  variant="standard"
                  value={dateOfBirth}
                  onChange={formik.handleChange}
                  error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
                  helperText={formik.touched.date_of_birth && formik.errors.date_of_birth}
                  {...params}
                />}
            />
            <TextField
              fullWidth
              autoComplete="off"
              type="password"
              variant="standard"
              id="password"
              name="password"
              label="Password"

              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              fullWidth
              autoComplete="off"
              margin="dense"
              type="password"
              variant="standard"
              id="passwordConfirmation"
              name="passwordConfirmation"
              label="Confirm Password"

              value={formik.values.passwordConfirmation}
              onChange={formik.handleChange}
              error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
              helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

export default Add