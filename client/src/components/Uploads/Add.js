import React from 'react'
import { useFormik, Formik, ErrorMessage, } from 'formik';
import * as yup from 'yup';
import _ from 'lodash-contrib';
import { useSnackbar } from 'notistack';
import { useLocation } from "react-router-dom"
// import Dropzone, { useDropzone } from 'react-dropzone'
// import { fromImage } from 'imtool'
// import { useDispatch, useSelector } from "react-redux";

// Material
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Stack,
  Paper,
  Typography,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

// Custom
import { useMutation } from "@apollo/client";
import { UPLOAD_MULTIPLE_FILES, } from "../../app/queries";
import { makePageTitleFromPath } from '../../app/functions/text'
import Thumbnails from './thumbnails'
import Uploads from './uploads'
import AutocompleteControlled from './tagging'

const Add = (props) => { //{ onClick, active, refetch, data, setData }
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(props.active);
  const location = useLocation();
  const [pagetitle, setPagetitle] = React.useState(makePageTitleFromPath(location.pathname))

  // Filereader section
  // const [fileURL, setFileURL] = React.useState(null);
  // const [thumbnailURL, setThumbnailURL] = React.useState(null);
  // const [maxSize, setMaxSize] = React.useState(250);
  // let reader = null
  // reader = React.useMemo(() => new FileReader(), [reader])
  // const _listener = () => {
  //   console.log('_listener')
  //   setFileURL(reader.result);
  // }
  // reader.addEventListener("load", _listener, false);

  // GraphQL
  const [tags, setTags] = React.useState([])
  const [files, setFiles] = React.useState([]);
  const [uploadFile, error] = useMutation(UPLOAD_MULTIPLE_FILES, {
    onCompleted: (data) => {
      console.log('uploadFile', data)
      const variant = 'success'
      enqueueSnackbar(pagetitle + ' created successfully', { variant })
      // formik.resetForm()
      handleClose()
      // props.onClick(false)
      // setOpen(false)
      // props.refetch();
    },
    onError: (error) => {
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
      console.log('uploadFile error', error)
    }
  })

  // Formik
  const validationSchema = yup.object().shape({
    title: yup.string('Enter title').required('Required'),
    description: yup.string('Enter description'),
    files: yup.array().min(1, 'Select file(s)').required(),
    tags: yup.array(),
  });
  const formik = useFormik({
    initialValues: {
      owner: props.owner,
      title: 'Project title',
      description: 'Project description',
      files: [],
      tags: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      values.owner = props.owner
      values.files = values.files.length === 0 ? files : values.files
      values.tags = tags
      console.log('onSubmit', values)
      //return
      const flatTagList = _.map(tags, "title")
      console.log('flatTagList', flatTagList)
      // return
      uploadFile({
        variables: {
          files: values.files,
          owner: values.owner,
          title: values.title,
          description: values.description,
          tags: JSON.stringify(flatTagList)
        }
      })
      // formik.resetForm()
      // handleClose()
    },
  })

  const handleClose = () => {
    props.onClick(false)
    formik.resetForm()
    setFiles([])
    setOpen(false)
    props.refetch()
  };

  React.useEffect(() => {
    setOpen(props.active)
    return () => {
      //reader.removeEventListener("load", _listener, false)
    }
  }, [props.active])

  return (
    <div>
      {error && error.graphQLErrors && <pre> {JSON.stringify(error.graphQLErrors.message, null, 2)} </pre>}
      <Dialog
        fullWidth
        maxWidth={'lg'}
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
            <Grid container>
              <Grid item sx={{ flexGrow: 1, }}>
                <Stack direction="column" spacing={1} >
                  <Stack direction="column" spacing={1} >
                    <Stack direction="row" spacing={1} >
                      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, }}>
                        <TextField
                          sx={{ display: 'none' }}
                          autoFocus
                          margin="dense"
                          id="owner"
                          name="owner"
                          label="Creator"
                          type="text"
                          fullWidth
                          variant="standard"
                          disabled
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
                          rows={2}
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
                        height: '150px',
                        width: '300px',
                        flexDirection: 'row',
                        alignContent: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.custom.light,
                        p: 1,
                      }}>
                        <Uploads setFieldValue={formik.setFieldValue} setFiles={setFiles} />
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ width: '100%', height: 350 }}>
                      <Thumbnails files={files} />
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item sx={{ width: 300, }}>
                <Box sx={{ width: 280, height: 350 }}>
                  <AutocompleteControlled tags={tags} setTags={setTags} />
                </Box>
              </Grid>
            </Grid>


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


// const UploadComponent = props => {
//   //const [files, setFiles] = React.useState([]);
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: 'image/*',
//     onDrop: acceptedFiles => {
//       props.setFiles(acceptedFiles.map(file => Object.assign(file, {
//         preview: URL.createObjectURL(file)
//       })))
//       props.setFieldValue("files", acceptedFiles)
//     }
//   })
//   return (
//     <Paper {...getRootProps()}
//       className="dropzone"
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignContent: 'stretch',
//         justifyContent: 'space-evenly',
//         alignItems: 'center',
//         height: '75%',
//       }}
//       sx={{ p: 2 }}
//     >
//       <Typography component='div' variant='body2'>
//         Drag 'n' drop some files here, or click to select files
//       </Typography>
//       <input {...getInputProps()} />
//     </Paper>
//   )
// }


// const ThumbsComponent = props => {
//   if (props.files.length === 0) return <Alert severity="error" sx={{ width: '100%', height: 35 }}>{'No files selected'}</Alert>
//   return (
//     <ImageList
//       sx={{ width: '100%', height: 350 }}
//       variant="quilted"
//       cols={5}
//       rowHeight={201}
//       gap={1}
//     >
//       {props.files && props.files.map((item) => {
//         return (
//           <ImageListItem
//             key={item.name}
//             sx={{
//               maxWidth: '200px !important',
//               maxHeight: '200px !important',
//               height: '200px !important',
//               backgroundColor: grey[100],
//               background: grey[100]
//             }}
//             cols={item.cols || 1} rows={item.rows || 1}

//           >
//             <img
//               src={item.preview}
//               srcSet={item.preview}
//               alt={item.name}
//               loading="lazy"
//               style={{ maxWidth: '200px !important', maxHeight: '200px !important', objectFit: 'contain' }}
//               onLoad={() => { URL.revokeObjectURL(item.preview) }}
//             />
//             <ImageListItemBar
//               title={<Typography component="span" variant="caption">{item.name}</Typography>}
//               subtitle={<Typography component="span" variant="caption">{formatBytes(item.size)}</Typography>}
//               actionIcon={
//                 <IconButton
//                   sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
//                   aria-label={`delete ${item.name}`}

//                 >
//                   <DeleteOutlineOutlinedIcon fontSize="large" />
//                 </IconButton>
//               }
//             />
//           </ImageListItem>
//         )
//       })}
//     </ImageList>
//   )



// }
/* {files && files.map( (file) =>  {
                return <img 
                  src={file.preview} 
                  style={{width:'200px', height:'200px'}}
                  onLoad={() => { URL.revokeObjectURL(file.preview) }} 
                />
              })
              } */