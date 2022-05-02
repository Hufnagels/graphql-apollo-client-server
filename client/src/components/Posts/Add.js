import React from 'react'
import { Formik, useFormik } from "formik";
import { ContentState } from "draft-js";
import * as yup from 'yup';
import _ from 'lodash';
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
  DialogContentText,
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

const Add = ({ onClick, active, refetch, setData }) => {

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = React.useState(active);
  const [scroll, setScroll] = React.useState('paper');

  const [createPost, { data, loading, error }] = useMutation(CREATE_POST);

  const formik = useFormik({
    initialValues: {
      "author": '',
      "title": '',
      "subtitle": null,
      "description": null,
      "titleimage": null
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // console.log('values', values)
      //const newData = _.omit(values, 'passwordConfirmation')

      createPost({ variables: { input: values } }).then((res) => {
        // console.log(res)
        //setData(prevState => [...prevState, res.data.createPost])
        const variant = 'success'
        enqueueSnackbar('User created successfully', { variant })
        setOpen(false)
        onClick(false)
        formik.resetForm()
        refetch();
      }).catch(err => {
        //console.log('createUser catch', JSON.stringify(err, null, 2))

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
                  Add new post
                </Typography>
                <Button color="inherit" type="submit" onClick={formik.handleSubmit}>Add</Button>
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
                <Grid item xs={12} md={12} lg={12} sx={{ paddingBottom: '2rem' }}>
                  <Typography variant="body2" component="div">formik values == {JSON.stringify(formik.values)}</Typography>
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
      </form>
    </div>
  )
}

export default Add