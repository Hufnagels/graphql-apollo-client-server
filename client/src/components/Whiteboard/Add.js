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

// Custom
import {
  useMutation
} from "@apollo/client";
import { CREATE_BOARD, GET_BOARDS } from "../../app/queries";
import { makePageTitleFromPath } from '../../app/functions/text'

const validationSchema = yup.object({
  owner: yup
    .string('Enter your name')
    .min(2, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required'),
  title: yup
    .string('Enter title')
    .required('Required'),
  description: yup
    .string('Enter description'),
});

const Add = ({ onClick, active, refetch, data, setData }) => {

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(active);
  const location = useLocation();
  const [title, setTitle] = React.useState(makePageTitleFromPath(location.pathname))

  const [createBoard, { error }] = useMutation(CREATE_BOARD, {
    //refetchQueries: [{ query: GET_BOARDS }],
    onCompleted: ({ createBoard }) => {
      console.log('createBoard completed', createBoard)
      const variant = 'success'
      enqueueSnackbar(title + ' created successfully', { variant })

      onClick(false)
      setOpen(false)
      refetch();
    },
    onError: (error) => {
      // console.log('CREATE_MINDMAP error', error)
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  });

  const emptyBoardData = {
    board: '[]',
    boardimage: '',
  }
  const formik = useFormik({
    initialValues: {
      owner: 'varkonyi',
      title: 'New Empty board',
      description: 'New Empty board',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {

      const newData = _.merge(values, emptyBoardData)
      createBoard({ variables: { input: newData } })
    },
  })

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
            <DialogContentText>Please, fill form below to add new {title}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="owner"
              name="owner"
              label="Creator"
              type="text"
              fullWidth
              variant="standard"
              value={formik.values.owner}
              onChange={formik.handleChange}
              error={formik.touched.owner && Boolean(formik.errors.owner)}
              helperText={formik.touched.owner && formik.errors.owner}
            />
            <TextField
              autoFocus
              margin="dense"
              id="title"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextField
              autoFocus
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
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