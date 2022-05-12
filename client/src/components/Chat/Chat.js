import React from "react";
import {
  useLazyQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from 'notistack';
import { useFormik, } from 'formik';
import * as yup from 'yup';

// Material
import {
  CssBaseline,
  Button,
  TextField,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';
import DirectionsIcon from '@mui/icons-material/Directions';

// Custom
import Messages from './Message'
import { GET_MESSAGES, POST_MESSAGE, SUBSCRIBE_TO_MESSAGES } from '../../app/queries'

const validationSchema = yup.object({
  content: yup
    .string('Enter your message')
    .required('Message is required')
    //.matches(/^[ A-Za-z0-9_@./#&+-]*$/),
});

const Chat = () => {
  const theme = useTheme();
  const chatWrapperRef = React.useRef(null)
  const chatMessageRef = React.useRef(null)
  const { enqueueSnackbar } = useSnackbar();

  const { isLoggedIn, user, tokens } = useSelector((state) => state.auth);

  // Messages
  const [chatmessagesData, setChatmessagesData] = React.useState({ messages: [] })
  const [postMessage] = useMutation(POST_MESSAGE);
  const [state, stateSet] = React.useState({
    user: user.lastName + ' ' + user.firstName,
    content: '',
  });
  const { data, loading } = useSubscription(SUBSCRIBE_TO_MESSAGES, {
    onSubscriptionData: (e) => {
      console.log('onSubscriptionData', e, e.subscriptionData.data.messages)
      const messages = e.subscriptionData.data.messages
      setChatmessagesData({
        ...chatmessagesData,
        messages
      })
    },
    onError: (error) => {
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  });
  const formik = useFormik({
    initialValues: {
      user: user.lastName + ' ' + user.firstName,
      content: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
console.log('onSubmit', values)
      postMessage({
        variables: values,
      });
      formik.resetForm()
    },
  })
  /* const onSend = () => {
    if (state.content.length > 0) {
      postMessage({
        variables: state,
      });
    }
    stateSet({
      ...state,
      content: "",
    });
  }; */

  React.useEffect(() => {
    if (!data) return
    chatMessageRef.current.scrollTop = chatMessageRef.current.scrollHeight;
  }, [data])

  return (
    <React.Fragment>
      <CssBaseline />
      <Paper sx={{ minHeight: 'calc(100vh - 110px)' }} elevation={0}>
        <Grid container spacing={0} >
          <Grid item xs={4}
            style={{ minHeight: '100%', }}
          >
            <h5>online users</h5>
          </Grid>
          <Grid item xs={8} style={{ minHeight: '100%', }}>
            <Paper elevation={3}>
              <Grid container spacing={0} style={{ border: 'none', }} ref={chatWrapperRef}>
                <Grid item xs={12} style={{ display: 'flex', border: 'none', flexDirection: 'row', alignContent: 'space-between' }}>
                  <Stack
                    ref={chatMessageRef}
                    spacing={2}
                    direction="column"
                    style={{ padding: theme.spacing(1), width: '100%', height: 'calc(100vh - 155px)', overflowY: 'auto', }}
                  >
                    {!loading && <Messages user={state.user} data={chatmessagesData} />}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    /* component="form" */
                    sx={{ 
                      p: '2px 4px', 
                      backgroundColor: theme.palette.custom.light 
                    }}
                    /* onSubmit={() => onSend()} */
                  >
                    <form 
                      onSubmit={formik.handleSubmit} 
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'center',
                        justifyContent: 'space-around',
                        alignItems:'center',
                      }}
                    >
                    <TextField
                      
                      autoFocus
                      margin="dense"
                      id="content"
                      name="content"
                      
                      type="text"
                      autoComplete="on"
                      variant="standard"
                      value={formik.values.content}
                      onChange={formik.handleChange} 
                      /*onChange={(evt) =>
                        stateSet({
                          ...state,
                          content: evt.target.value,
                        })
                      }*/
                      error={formik.touched.content && Boolean(formik.errors.content)}
                      helperText={formik.touched.content && formik.errors.content}

                      sx={{ 
                        ml: 1,
                        mr:1, 
                        //flex: 1,
                        flexGrow:'1', 
                        fontSize: '.85rem', 
                      }}
                      /* placeholder="Type your message here"
                      label="Message"
                      variant="standard"
                      value={state.content}
                      onChange={(evt) =>
                        stateSet({
                          ...state,
                          content: evt.target.value,
                        })
                      }
                      onKeyUp={(event) => {
                        // To prevent form submission
                        event.preventDefault();
                        // To prevent td onClick
                        event.stopPropagation();
                        const key = event.key || event.keyCode;
                        if (key === 13) {
                          //onSend();
                          return;
                        }
                      }}
                      onKeyPress={(event) => {

                        const key = event.key || event.keyCode;
                        if (key === 13) {
                          //onSend();
                          return;
                        }
                      }} */
                    />
                    <Button 
                      type="submit" 
                      sx={{
                        color: theme.palette.custom.contrastText,
                        mt: theme.spacing(.5), 
                        mb: theme.spacing(.5), 
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'light'
                            ? theme.palette.info.light
                            : theme.palette.info.dark,
                      }}
                    >
                      <DirectionsIcon />
                    </Button>
                    </form>
                    
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
};

export default Chat;