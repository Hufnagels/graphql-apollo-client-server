import React from "react";
import {
  useSubscription,
  useMutation,
  gql,
} from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

// Material
import {
  CssBaseline,
  Button,
  TextField,
  Avatar,
  IconButton,
  InputBase,
  Chip,
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles';
import DirectionsIcon from '@mui/icons-material/Directions';

import useResizeObserver from '../../app/hooks/useResizeObserver.hook'


const SUBSCRIBE_TO_MESSAGES = gql`
  subscription OnMessageAdded {
    messages {
      id
      user
      content
    }
  }
`;

const QUERY_MESSAGES = gql`
  query Messages {
    messages {
      id
      user
      content
    }
  }
`;

const POST_MESSAGE = gql`
  mutation($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;

const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}
const stringAvatar = (nameString) => {
// console.log('stringAvatar nameString', nameString);
  const fullName = nameString.split(' ');
  const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
  return {
    sx: {
      bgcolor: stringToColor(nameString),
    },
    children: initials.toUpperCase() //`${name}` //`${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}
const BackgroundLetterAvatars = (user) => {
  //console.log('BackgroundLetterAvatars', user.user)
  //return null
  return (
    <Avatar {...stringAvatar(user.user)} sx={{ fontSize: '.85rem', }} size="small"/>
  );
}

const Messages = ({ user, data }) => {
  if (!data) {
    return null;
  }
  //console.log('Messages data', user, data)
  return (
    <React.Fragment>
      {data.messages.map(({ id, user: messageUser, content }) => (
        <div
          key={id}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: user === messageUser ? "row-reverse" : "row",
            paddingBottom: "0.2rem",
          }}
        >
          {user !== messageUser && (
            
            <BackgroundLetterAvatars user={messageUser} />
          )}
          <Chip
            component="div"
            variant={user === messageUser ? "outlined" : ""}
            label={(
              <Typography
                variant="body"
                component="div"
                style={{ whiteSpace: 'normal', paddingTop: '6px', paddingBottom: '6px' }}
              >{content}</Typography>
            )}
            sx={{ marginTop: '16px', maxWidth: '70%', height: 'auto !important', minHeight: '32px !important' }}
          />
        </div>
      ))}
    </React.Fragment>
  );
};

const Chat = () => {
  const theme = useTheme();
  const chatWrapperRef = React.useRef(null)
  const chatMessageRef = React.useRef(null)
  const dimensions = useResizeObserver(chatWrapperRef)
  const [width, setWidth] = React.useState(100)
  const [height, setHeight] = React.useState(100)

  const { isLoggedIn, user, tokens } = useSelector((state) => state.auth);

  // Message
  const [state, stateSet] = React.useState({
    user: user.lastName + ' ' + user.firstName,
    content: "",
  });
  const { data, loading } = useSubscription(SUBSCRIBE_TO_MESSAGES, {
    onSubscriptionData: (e) => console.log(e),
  });
  const [postMessage] = useMutation(POST_MESSAGE);

  const onSend = () => {
    if (state.content.length > 0) {
      postMessage({
        variables: state,
      });
    }
    stateSet({
      ...state,
      content: "",
    });
  };

  React.useEffect(() => {
    console.log("Chat dimensions")
    if (!dimensions) return;
    setWidth(dimensions.width)
    setHeight(dimensions.height)
    console.log(dimensions)
  }, [dimensions])

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
                    <Messages user={state.user} data={data} />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', backgroundColor: theme.palette.custom.light}}

                  >
                    {/* <TextField
                      label="User"
                      variant="standard"
                      value={state.user}
                      onChange={(evt) =>
                        stateSet({
                          ...state,
                          user: evt.target.value,
                        })
                      }
                    /> */}
                    <TextField
                      sx={{ ml: 1, flex: 1, fontSize: '.85rem', }}
                      placeholder="Type your message here"
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
                        const key = event.key || event.keyCode;
                        if (key === 13) {
                          onSend();
                        }
                      }}
                    />
                    <IconButton color="primary" sx={{ p: '10px' }} onClick={() => onSend()} >
                      <DirectionsIcon />
                    </IconButton>
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