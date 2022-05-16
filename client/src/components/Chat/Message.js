import React, { useEffect, useRef } from "react";

// Material
import {
  Avatar,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';

// Custom

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
  const fullName = nameString.split(' ');
  // console.log('stringAvatar nameString', nameString, Array.isArray(fullName), fullName.length);

  const initials = (Array.isArray(fullName) && fullName.length > 1)? fullName.shift().charAt(0) + fullName.pop().charAt(0) : fullName.shift().charAt(0)
  return {
    sx: {
      bgcolor: stringToColor(nameString),
    },
    children: initials.toUpperCase() //`${name}` //`${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}
const BackgroundLetterAvatars = (user) => {
  // console.log('BackgroundLetterAvatars', user.user)
  // return null
  return (
    <Avatar {...stringAvatar(user.user)} sx={{ fontSize: '.85rem', }} size="small" />
  );
}

const Messages = ({ user, data }) => {
  // console.log('Messages data', user, data.messages)
  const chatMessageRef = useRef(null)
  const theme = useTheme();

  //return null
  useEffect(() => {
    if (!data) return
    chatMessageRef.current.scrollTop = chatMessageRef.current.scrollHeight;
  }, [data])

  return (
    <React.Fragment>
      <Stack
        ref={chatMessageRef}
        spacing={2}
        direction="column"
        style={{ padding: theme.spacing(1), width: '100%', height: 'calc(100vh - 155px)', overflowY: 'auto', }}
      >
        {data.messages.map(({ id, user: messageUser, content }) => (
          <div
            key={id}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: user === messageUser ? "row-reverse" : "row",
              paddingBottom: "0.2rem",
              marginTop: theme.spacing(.5)
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
      </Stack>
    </React.Fragment>
  );
};

export default Messages