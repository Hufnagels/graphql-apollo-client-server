import React from 'react'
import { useFormik } from "formik";
import * as yup from 'yup';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import { useParams, useNavigate } from "react-router-dom";

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
import CloseIcon from '@mui/icons-material/Close';

// Custom
import {
  useQuery,
  useMutation
} from "@apollo/client";
import { GET_POST, UPDATE_POST } from "../../app/queries";
import { TextEditor } from "../Texteditor/editor";

/* const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} timeout={{ enter: 5, exit: 5, }} {...props} />;
}); */

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

const Edit = ({ onClick, active, refetch, setData }) => {
  let { id } = useParams('id');
  const navigate = useNavigate();
  //  console.log('Edit', id);
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

  const { loading, error, data } = useQuery(GET_POST,
    {
      variables: { id },
      fetchPolicy: "network-only",
    },

  );

  const [updatePost] = useMutation(UPDATE_POST, {
    onCompleted: ({ getPost }) => {
      const variant = 'success'
      enqueueSnackbar('Post updated successfully', { variant })
      // navigate(-1)
      // setOpen(false)
      //onClick(false)
      //formik.resetForm()
    },
    onError: (error) => {
      // console.log(error)
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
//console.log('values', values)
      const newData = _.omit(values, ['author', '__typename', 'createdAt', 'updatedAt'])

      updatePost({ variables: { id: id, input: newData } })
      
    },
  })

  const handleClose = () => {
    setOpen(false);
    navigate(-1)
    formik.resetForm()
  };

  const descriptionElementRef = React.useRef(null);

  React.useEffect(() => {
    if (!data) return
    //data.getPost = _.omit(data.getPost, ['__typename'])
    const filteredData = _.omitBy(data.getPost, _.isNil)
    _.merge(formik.initialValues, filteredData)
    formik.initialValues = _.omit(formik.initialValues, ['__typename'])
    // console.log('Edit ListIndex --> data useEffect orig data', data.getPost)
    // console.log('Edit ListIndex --> data useEffect filteredData', filteredData)
    // console.log('Edit ListIndex --> formik initialValues', formik.initialValues)
    setOpen(true)
  }, [data]);

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <div>
      {error && <pre>
        {JSON.stringify(error, null, 2)}
      </pre>}
      {data.getPost &&
        <form onSubmit={formik.handleSubmit}>
          <Dialog
            fullScreen
            open={open}
            onClose={(_, reason) => {
              if (reason !== "backdropClick") {
                handleClose();
              }
            }}
            scroll={scroll}
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
                  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Update post
                  </Typography>
                  <Button color="inherit" type="submit" onClick={formik.handleSubmit}>Update</Button>
                </Toolbar>
              </AppBar>{/*  */}
            </DialogTitle>

            <DialogContent dividers={scroll === 'paper'}>
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
                  <Grid item xs={11} md={11} lg={11} sx={{ paddingBottom: '2rem' }}>
                    {/* <Typography variant="body2" component="div">formik values == {JSON.stringify(formik.values)}</Typography> */}
                    <TextEditor
                      setFieldValue={(val) => formik.setFieldValue("description", val)}
                      value={formik.values.description}

                    />
                  </Grid>
                  <Grid item>

                    {/* <MobileDatePicker
            label="Activation time"
            value={dateOfBirth}
            minDate={new Date()}
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
          /> */}
                  </Grid>
                </Grid>

              </div>

            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>

            </DialogActions>
          </Dialog>
        </form>}
    </div>
  )
}

export default Edit