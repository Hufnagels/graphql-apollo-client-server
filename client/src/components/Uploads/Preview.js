import * as React from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, } from "@apollo/client";
import { useSnackbar } from 'notistack';

// Material
import {
  Box,
  Grid,
  CircularProgress,
  Paper,
  Typography,
  Stack,
  Chip,
} from '@mui/material'

// Custom
import { GET_FILE } from "../../app/queries";
import { makePageTitleFromPath } from '../../app/functions/text'
import { formatTimeToCurrentTimeZone } from '../../app/functions/time'
import { NO_IMAGE } from '../../app/app.options'

const Preview = (props) => {

  let { id } = useParams('id')
  const location = useLocation()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [title, setTitle] = React.useState(makePageTitleFromPath(location.pathname))

  //const { post } = props;
  const [file, setFile] = React.useState(null)
  const [image, setImage] = React.useState(null)
  // console.log('Preview props', props, id);

  const { data, loading, error } = useQuery(GET_FILE, {
    variables: { id: id },
    onComplete: ({ getFile }) => {
      console.log('GET_FILE', getFile)
    },
    onError: (err) => {
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  });

  React.useEffect(() => {
    // console.log('FilePreview --> data useEffect', data?.getFile)
    if (!data) return
    setFile(data.getFile)
    if (data.getFile.contentType.match('image.*'))
      setImage(`data:${data.getFile.contentType};base64,${data.getFile.file}`)
    else
      setImage(NO_IMAGE)

    //  console.log(data)
  }, [data])

  if (loading) return <CircularProgress color="secondary" />
  // console.log('data', data)
  // return null
  return (
    <React.Fragment>
      {error && <pre>
        {JSON.stringify(error, null, 2)}
      </pre>}
      <button onClick={() => navigate(-1)}>go back</button>
      {file &&
        <Paper
          sx={{
            position: 'relative',
            backgroundColor: 'grey.800',
            color: '#fff',
            mb: 4,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url(${file.metadata.thumbnail})`,
          }}
        >
          <Grid container>
            <Grid item md={12}>
              <Box
                sx={{
                  p: 1,
                  pr: { md: 0 },
                  backgroundColor: '#aeaeae',
                }}
              >
                <Stack direction="row" spacing={2} >
                  <Box>
                    <img
                      src={image} //{`data:${file.contentType};base64,${file.file}`}
                      style={{ display: 'block', width: 'auto', height: '70vh' }}
                      alt={file.filename}
                    />
                  </Box>
                  <Stack direction="column" spacing={2}>
                    <Box>
                      <Typography component="h1" variant="h5" color="inherit" gutterBottom>
                        {file.metadata.title}
                      </Typography>
                      <Typography component="div" variant="h6" color="inherit" gutterBottom>
                        {file.metadata.description}
                      </Typography>
                      <Typography component="div" variant="body2" color="inherit" gutterBottom>
                        {file.filename}
                      </Typography>
                      <Typography component="div" variant="body2" color="inherit" gutterBottom>
                        {formatTimeToCurrentTimeZone(file.uploadDate, 'hu-HU')}
                      </Typography>
                    </Box>
                    <Box>
                      <Stack direction="row" spacing={1}>
                        {file.metadata.tags && file.metadata.tags.map(tag => {
                          return <Chip label={tag} variant="filled" color="custom" key={tag} />
                        })}
                      </Stack>

                    </Box>
                  </Stack>

                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>}
    </React.Fragment>
  );
}

/* Preview.propTypes = {
  post: PropTypes.shape({
    description: PropTypes.string.isRequired,
    //titleimage: PropTypes.string.isRequired,
    //imageText: PropTypes.string.isRequired,
    //linkText: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
  }).isRequired,
}; */

export default Preview;