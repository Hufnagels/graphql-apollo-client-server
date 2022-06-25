import React from 'react'
import { useFormik, useFormikContext } from 'formik';
import * as yup from 'yup';
import _ from 'lodash-contrib';
import { useSnackbar } from 'notistack';
import { useLocation } from "react-router-dom"
import Dropzone from 'react-dropzone'
import { fromImage } from 'imtool'
import { useDispatch, useSelector } from "react-redux";

// Material
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Stack,
  Paper,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Custom
import {
  useMutation
} from "@apollo/client";
import { UPLOAD_SINGLE_FILE, UPLOAD_MULTIPLE_FILES, } from "../../app/queries";
import { makePageTitleFromPath } from '../../app/functions/text'

const validationSchema = yup.object().shape({
  title: yup
    .string('Enter title')
    .required('Required'),
  description: yup
    .string('Enter description'),
  file: yup.mixed().required(),
});

const Add = (props) => { //{ onClick, active, refetch, data, setData }
  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(props.active);
  const location = useLocation();
  const [pagetitle, setPagetitle] = React.useState(makePageTitleFromPath(location.pathname))

  const [file, setFile] = React.useState(null);
  const [fileURL, setFileURL] = React.useState(null);
  const [thumbnailURL, setThumbnailURL] = React.useState(null);

  const [maxSize, setMaxSize] = React.useState(250);
  //const { setFieldValue } = useFormikContext()
  let reader = null
  reader = React.useMemo(() => new FileReader(), [reader])

  const _listener = () => {
    setFileURL(reader.result);
  }
  reader.addEventListener("load", _listener, false);

  const [uploadFile, error] = useMutation(UPLOAD_MULTIPLE_FILES, {
    onCompleted: (data) => {
      console.log('uploadFile', data)
      const variant = 'success'
      enqueueSnackbar(pagetitle + ' created successfully', { variant })

      props.onClick(false)
      setOpen(false)
      props.refetch();
    },
    onError: (error) => {
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  })

  const formik = useFormik({
    initialValues: {
      owner: props.owner,
      title: 'New file',
      description: 'New file description',
      file: null
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {

      values.file = file
      console.log('onSubmit', values)
      uploadFile({
        variables: {
          file: values.file,
          owner: values.owner,
          title: values.title,
          description: values.description,
        }
      })
      handleClose()
    },
  })

  const handleClose = () => {
    props.onClick(false)
    formik.resetForm()
    setOpen(false);
  };

  React.useEffect(() => {
    setOpen(props.active)
    return () => {
      reader.removeEventListener("load", _listener, false)
    }
  }, [props.active])

  React.useEffect(() => {
    if (file) {
      reader.readAsDataURL(file);
      formik.values.file = file
      console.log(file)
      console.log('formik.values', formik.values)
    }
  }, [file, reader]);

  React.useEffect(() => {
    if (fileURL) {
      console.log('fileURL', file.type)
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return false
      if (file.type === "application/json") return false
      if (file.type === "application/pdf") return false // yarn add react-pdf https://github.com/wojtekmaj/react-pdf
      if (file.type === "application/json") return false

      /**
       * image/apng: Animated Portable Network Graphics (APNG)
       * image/avif : AV1 Image File Format (AVIF)
       * image/gif: Graphics Interchange Format (GIF)
       * image/jpeg: Joint Photographic Expert Group image (JPEG)
       * image/png: Portable Network Graphics (PNG)
       * image/svg+xml: Scalable Vector Graphics (SVG)
       * image/webp: Web Picture format (WEBP)
       */
      console.log('fileURL file.type', _.strContains(file.type, "image"))
      if (_.strContains(file.type, "image")) {
        fromImage(fileURL)
          .then(tool => tool.thumbnail(maxSize, false).toDataURL())
          .then((url) => setThumbnailURL(url))
          .catch(e => console.log(e))
        // }).then((url) => setThumbnailURL(url));
        console.log('setThumbnailURL', thumbnailURL)
      }

    }
  }, [fileURL]);

  const onDrop = acceptedFiles => setFile(acceptedFiles[0]);

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
        <DialogTitle id="draggable-dialog-title">Add new {pagetitle}</DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText>Please, fill form below to add new {pagetitle}</DialogContentText>
            <Stack direction="row" spacing={2}>
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, }}>
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
                  multiline
                  rows={4}
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
              </Box>

              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                height: '300px',
                width: '300px',
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.custom.light,
                p: 1,
              }}>
                <Dropzone onDrop={onDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <Paper {...getRootProps()} className="dropzone"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignContent: 'stretch',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        height: '90%',

                      }}
                      sx={{ p: 2 }}
                    >
                      <Typography component='div' variant='body2'>Drag 'n' drop some files here, or click to select files</Typography>
                      <input {...getInputProps()} accept="image/jpeg, image/png" />
                      {thumbnailURL ?
                        <img className="output__image"
                          src={thumbnailURL}
                          alt="The thumbnail generated with nailit." />
                        :
                        <span>Upload an image first.</span>
                      }
                    </Paper>
                  )}
                </Dropzone>
              </Box>
            </Stack>


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