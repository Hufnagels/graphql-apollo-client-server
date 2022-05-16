import React from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useLocation } from 'react-router-dom'
import _ from 'lodash'
import { useSnackbar } from 'notistack';

// Material
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Slide,
} from '@mui/material';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import CloseIcon from '@mui/icons-material/Close';

// Custom
import {
  useMutation
} from "@apollo/client";
import { CREATE_POST } from "../../app/queries";
import { TextEditor } from "../Texteditor/editor";
import { makePageTitleFromPath } from '../../app/functions/text'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} timeout={{ enter: 5, exit: 5, }} {...props} />;
});

const validationSchema = yup.object({
  author: yup
    .string('Enter your username')
    .min(2, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required'),
  title: yup
    .string('Enter your title')
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  subtitle: yup
    .string('Enter your subtitle')
    .nullable(true)
    .min(2, 'Too Short!')
    .max(100, 'Too Long!')
    .transform((_, val) => val === String(val) ? val : null),
  description: yup
    .string('Enter your description')
    .nullable(true)
    .transform((_, val) => val === String(val) ? val : null),
  titleimage: yup
    .string()
    .nullable(true)
    .default(null)
    .transform((_, val) => val === String(val) ? val : null),
});

const Add = ({ onClick, active, refetch }) => {

  const location = useLocation();
  const [title, setTitle] = React.useState(makePageTitleFromPath(location.pathname))
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(active);


  const [createPost, { error }] = useMutation(CREATE_POST, {
    onCompleted: ({ createPost }) => {
      // console.log('CREATE_POST completed', createPost)
      const variant = 'success'
      enqueueSnackbar(title + ' created successfully', { variant })
      onClick(false)
      setOpen(false)
      refetch();
    },
    onError: (error) => {
      // console.log('CREATE_POST error', error)
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  });

  const formik = useFormik({
    initialValues: {
      "author": '',
      "title": '',
      "subtitle": '',
      "description": '',
      "titleimage": ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // console.log('CREATE_POST', values)
      createPost({ variables: { input: values } })
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

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  React.useEffect(() => {
    setOpen(active)
  }, [active])

  return (
    <div>
      {error && error.graphQLErrors && <pre>
        {JSON.stringify(error.graphQLErrors.message, null, 2)}
      </pre>}
      <form onSubmit={formik.handleSubmit}>
        <Dialog
          fullScreen
          TransitionComponent={Transition}
          open={open}
          onClose={(_, reason) => {
            if (reason !== "backdropClick") {
              handleClose();
            }
          }}
          scroll={'paper'}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title" sx={{ padding: '0 !important' }}>
            <AppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">Add new {title}</Typography>
                <Button color="inherit" type="submit" onClick={formik.handleSubmit}>Add</Button>
              </Toolbar>
            </AppBar>{/*  */}
          </DialogTitle>

          <DialogContent >
            <div
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <Grid
                container
                spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}
                justifyContent="flex-start"
                alignItems="flex-start"
              >

                <Grid item xs={12} md={4} lg={4}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="author"
                    name="author"
                    label="Author"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formik.values.author}
                    onChange={formik.handleChange}
                    error={formik.touched.author && Boolean(formik.errors.author)}
                    helperText={formik.touched.author && formik.errors.author}
                  />
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="titleimage"
                    name="titleimage"
                    label="Title image"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formik.values.titleimage}
                    onChange={formik.handleChange}
                    error={formik.touched.titleimage && Boolean(formik.errors.titleimage)}
                    helperText={formik.touched.titleimage && formik.errors.titleimage}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
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
                </Grid>
                <Grid item xs={12} md={6} lg={8}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="subtitle"
                    name="subtitle"
                    label="Subitle"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formik.values.subtitle}
                    onChange={formik.handleChange}
                    error={formik.touched.subtitle && Boolean(formik.errors.subtitle)}
                    helperText={formik.touched.subtitle && formik.errors.subtitle}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12} sx={{ paddingBottom: '2rem' }}>
                  <Typography variant="body2" component="div">formik values == {JSON.stringify(formik.values)}</Typography>
                  <TextEditor
                    setFieldValue={(val) => formik.setFieldValue("description", val)}
                    value={formik.values.description}
                  />
                </Grid>
                <Grid item>
                </Grid>
              </Grid>

            </div>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  )
}

export default Add