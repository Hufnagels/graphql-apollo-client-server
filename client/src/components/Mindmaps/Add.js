import React from 'react'
import { useFormik, } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import uuid from "react-uuid";

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
import { CREATE_MINDMAP } from "../../app/queries";

const validationSchema = yup.object({
  owner: yup
    .string('Enter your name')
    .min(2, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required'),
  title: yup
    .string('Enter title')
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  description: yup
    .string('Enter description')
});

const Add = ({ onClick, active, refetch, setData }) => {

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(active);

  const [createMindmap, { data, loading, error }] = useMutation(CREATE_MINDMAP);

  const emptyMap = {
    id: uuid(),
    type: "root",
    name: "first",
    x: 10,
    y: 140,
    direction: 1,
    width: 180,
    height: 100,
    background: "#FFFFFF",
    children: []
  }
  const emptyMapRecord = {
    originalMap: JSON.stringify(emptyMap),
    currentMap: JSON.stringify(emptyMap),
    mapimage: null,
  }
  const formik = useFormik({
    initialValues: {
      owner: 'varkonyi',
      title: 'New Empty map',
      description: 'New Empty map',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {

      const newData = _.merge(values, emptyMapRecord)
      setOpen(false)
      onClick(false)
      //console.log('add map ', newData)
      //return null
      createMindmap({ variables: { input: newData } }).then((res) => {
        //console.log('createMindmap promise', res)
        //setData(prevState => [...prevState, res.data.createMindmap])
        const variant = 'success'
        enqueueSnackbar('Mindmap created successfully', { variant })
        onClick(false)
        setOpen(false)
        refetch();
      }).catch(err => {
        //console.log('createMindmap catch', err)
        const variant = 'error'
        enqueueSnackbar(err.message, { variant })
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

  React.useEffect(() => {
    setOpen(active)
  }, [active])

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
        <DialogTitle id="draggable-dialog-title">Add new mindmap</DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText>
              Please, fill form below to add new mindmap
            </DialogContentText>
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