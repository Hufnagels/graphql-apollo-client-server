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
import { useMutation } from "@apollo/client";
import { UPDATE_BOARD, } from "../../app/queries";
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

const Update = (props) => { // { onClick, active, refetch, data, setData/* , updateBoard */ }

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(props.active);
  const location = useLocation();
  const [title, setTitle] = React.useState('')

  // const [updateBoard, { error }] = useMutation(UPDATE_BOARD, {

  //   onCompleted: ({ updateBoard }) => {
  //     console.log('UpdateItem updateBoard completed', updateBoard)
  //     const variant = 'success'
  //     enqueueSnackbar(' created successfully', { variant })

  //     onClick(false)
  //     setOpen(false)
  //     refetch();
  //   },
  //   onError: (error) => {
  //     // console.log('CREATE_MINDMAP error', error)
  //     const variant = 'error'
  //     enqueueSnackbar(error.message, { variant })
  //   }
  // });
  React.useEffect(() => {
    if (props.data === null) return
    console.log('UpdateItem data for update', props.data)
    _.merge(formik.initialValues, props.data)

    setTitle(props.data.title)
  }, [props.data])

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const id = values._id
      values = _.omit(values, ['__typename', 'updatedAt', 'createdAt', '_id'])
      //const newData = _.merge(data, values)
      console.log('UpdateItem values in formik onSubmit ', values)
      handleClose()
      props.updateBoard({
        variables: {
          id: id,
          input: {
            owner: values.owner,
            title: values.title,
            description: values.description,
            boardimage: values.boardimage,
            board: values.board,
            editinghistory: "",
          }
        }
      })
    },
  })

  const handleClose = () => {
    props.onClick(false)
    formik.resetForm()
    setOpen(false);
  };

  React.useEffect(() => {
    setOpen(props.active)
  }, [props.active])

  return (
    <div>

      {props.data && <Dialog
        fullWidth
        maxWidth={'md'}
        keepMounted
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        aria-labelledby="update-dialog-title"
      >
        <DialogTitle id="update-dialog-title">Update <strong>{title}</strong> (ID: {props.data._id}) </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText>Please, fill form below </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              name="title"
              label="Updated title"
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
              label="Updated description"
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
            <Button type="submit">Update</Button>
          </DialogActions>
        </form>
      </Dialog>}
    </div>
  )
}

export default Update