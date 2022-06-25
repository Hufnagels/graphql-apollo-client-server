import React from 'react'
import { useFormik, } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom'

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
import { useMutation } from "@apollo/client";
import { CREATE_MAP } from "../../app/queries";
import { makePageTitleFromPath } from '../../app/functions/text'

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

const Add = (props) => {

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(props.active);
  const location = useLocation();
  const [title, setTitle] = React.useState(makePageTitleFromPath(location.pathname))

  const [createMap, { error }] = useMutation(CREATE_MAP, {
    onCompleted: ({ createMap }) => {
      console.log('CREATE_MAP completed', createMap)
      //       setUsers({
      //         ...users,
      //         data: createMap.user
      //       })
      const variant = 'success'
      enqueueSnackbar(title + ' created successfully', { variant })
      props.onClick(false)
      setOpen(false)
      props.refetch();
    },
    onError: (error) => {
      // console.log('CREATE_MAP error', error)
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  });

  const formik = useFormik({
    initialValues: {
      "owner": props.owner,
      "title": '',
      "description": '',
      "originalMap": '',
      "currentMap": '',
      "mapimage": '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      //const newData = _.merge(values, emptyMapRecord)
      console.log('values', values)
      createMap({ variables: { input: values } })
    },
  })

  const handleClose = () => {
    setOpen(false);
    props.onClick(false)
    formik.resetForm()

  };

  React.useEffect(() => {
    setOpen(props.active)
  }, [props.active])

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