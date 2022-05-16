import * as React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {
  useQuery,
} from "@apollo/client";

// Material
import {
  Box,
  Grid,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material'

// Custom
import { GET_POST } from "../../app/queries";

const Preview = (props) => {
  let { id } = useParams('id');
  const navigate = useNavigate();

  //const { post } = props;
  const [post, setPost] = React.useState([])
  //  console.log('Preview props', props, id);

  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id: id }
  });

  React.useEffect(() => {
    //  console.log('PostsListIndex --> data useEffect')
    if (!data) return
    setPost(data.getPost)
    //  console.log(data)
  }, [data])

  if (loading) return <CircularProgress color="secondary" />
  //console.log('data', data)
  //return null
  return (
    <React.Fragment>
      {error && <pre>
        {JSON.stringify(error, null, 2)}
      </pre>}
      <button onClick={() => navigate(-1)}>go back</button>
      {data &&
        <Paper
          sx={{
            position: 'relative',
            backgroundColor: 'grey.800',
            color: '#fff',
            mb: 4,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url(${post.titleimage})`,
          }}
        >
          {/* Increase the priority of the hero background image */}
          {post.titleimage && <img style={{ display: 'none' }} src={post.titleimage} alt={post.imageText} />}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,

            }}
          />
          <Grid container>
            <Grid item md={12}>
              <Box
                sx={{
                  position: 'relative',
                  p: { xs: 3, md: 6 },
                  pr: { md: 0 },
                  backgroundColor: '#aeaeae',
                }}
              >
                <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                  {post.title}
                </Typography>
                <Typography component="h1" variant="h5" color="inherit" gutterBottom>
                  {post.subtitle}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  p: { xs: 3, md: 6 },
                  pr: { md: 0 },
                  backgroundColor: '#ffffff',
                  '&>.post img': {
                    width: '50% !important',
                    border: '10px solid rgba(0,255,255)'
                  }
                }}
              >
                <div className="post"
                  dangerouslySetInnerHTML={{ __html: post.description }}
                  style={{
                    
                  }}
                />
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