import React from 'react'
import { useFormik, } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';

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


const validationSchema = yup.object({
  username: yup
    .string('Enter your username')
    .min(2, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required'),
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

const Add = ({onClick, active, refetch, setUsers}) => {
  
  const [dateOfBirth, setDateOfBirth] = React.useState(new Date())
  const [open, setOpen] = React.useState(active);

  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

  const formik = useFormik({
    initialValues: {
      "username":'',
      "firstName":'',
      "lastName":'',
      "date_of_birth":null,
      "email": '',
      "password": 'Mancika72',
      "passwordConfirmation": 'Mancika72',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      values.date_of_birth = dateOfBirth.toISOString()
      const newData = _.omit(values, 'passwordConfirmation')
      setOpen(false)
      onClick(false)
      createUser({variables:{input:newData}}).then((res) => {
        setUsers(prevState => [...prevState, res.data.createUser])
        refetch();
      })
    },
  })

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClick(false)
    formik.resetForm()
    
  };

  React.useEffect(()=>{
    setOpen(active)
  },[active])

  return (
    <div>
      <Dialog
        keepMounted
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle id="draggable-dialog-title">Add new map</DialogTitle>
        
        <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <DialogContentText>
          Please, fill form below to add new user
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            autoFocus
            margin="dense"
            id="firstName"
            name="firstName"
            label="First name"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
          <TextField
            autoFocus
            margin="dense"
            id="lastName"
            name="lastName"
            label="Last name"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
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
          <TextField
            fullWidth
            id="passwordConfirmation"
            name="passwordConfirmation"
            label="Confirm Password"
            type="password"
            variant="standard"
            margin="dense"
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