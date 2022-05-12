import React from 'react'
import { useFormik, } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import { useSnackbar } from 'notistack';

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
import { CREATE_MAP } from "../../app/queries";


const validationSchema = yup.object({
  owner: yup
    .string('Enter your username')
    .required('Required'),
  title: yup
    .string('Enter your First name')
    .required('Required'),
  description: yup
    .string('Enter your Last name')
    .required('Required'),

});

const Add = ({ onClick, active, refetch, }) => {

  const { enqueueSnackbar } = useSnackbar();

  const [dateOfBirth, setDateOfBirth] = React.useState(new Date())
  const [open, setOpen] = React.useState(active);

  const [createMap, { error }] = useMutation(CREATE_MAP, {
    onCompleted: ({ createMap }) => {
      console.log('CREATE_MAP completed', createMap.user)
      //       setUsers({
      //         ...users,
      //         data: createMap.user
      //       })
      const variant = 'success'
      enqueueSnackbar('Map created successfully', { variant })
      onClick(false)
      setOpen(false)
      // console.log('createMap setUsers', users)
      refetch();
    },
    onError: (error) => {
      console.log('CREATE_MAP error', error)
    }
  });

  const formik = useFormik({
    initialValues: {
      "owner": '',
      "title": '',
      "description": '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      createMap({ variables: { input: values } })
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

  React.useEffect(() => {
    setOpen(active)
  }, [active])

  return (
    <div>
      {error && <pre>
        {JSON.stringify(error, null, 2)}
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
        <DialogTitle id="draggable-dialog-title">Add new map</DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText>
              Please, fill form below to add new map
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              name="title"
              label="title"
              type="text"
              fullWidth
              variant="standard"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextField
              fullWidth
              autoFocus
              multiline
              rows={4}
              margin="dense"
              id="description"
              name="description"
              label="description"
              type="text"
              variant="standard"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
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