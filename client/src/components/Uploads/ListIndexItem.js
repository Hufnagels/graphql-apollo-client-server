import React from 'react'
import { Link } from "react-router-dom";

// Material
import {
  Avatar,
  Box,
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Skeleton,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { deepOrange } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// Custom
import { formatTimeToCurrentTimeZone } from '../../app/functions/time'
import { stringToColor } from '../../app/functions/color'

const ListIndexItem = (props) => {
  // console.log('ListIndexItem',props.data)
  const theme = useTheme();
  const [data, serData] = React.useState(props.data)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>

      <Card sx={{ display: 'flex', flex: '1 0 auto', }} variant="outlined">
        {data.metadata.thumbnail ?
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            height: '180px',
            width: '180px',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.custom.light,
            p: 1,
          }}>
            <Link to={window.location.pathname + "/" + data._id + "/preview"} key={"filekey_p_key_" + data._id}>
              <CardMedia
                component="img"
                height={'180'}
                width={'180'}
                image={data.metadata.thumbnail}
                alt={data.metadata.title}
              />
            </Link>
          </Box>
          :
          <Skeleton variant="rectangular" height={180} width={180} style={{ height: '180px', width: '180px' }} />
        }
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="caption" style={{ wordBreak: 'break-all', wordWrap: 'break-word', hyphens: 'auto', width: '12rem' }}>{data.filename}</Typography>
            <Typography component="div" variant="body1">{data.metadata.title}</Typography>
            <Typography component="div" variant="body2" color="text.secondary" >{data.metadata.description}</Typography>

          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>

            <IconButton aria-label="edit data" onClick={() => props.edit(data._id)}>
              <ModeEditOutlineOutlinedIcon />
            </IconButton>

            <Link to={window.location.pathname + "/" + data._id + "/preview"} key={"file_p_key_" + data._id}>
              <IconButton aria-label="open data">
                <VisibilityOutlinedIcon />
              </IconButton>
            </Link>

            <IconButton aria-label="delete board" onClick={() => props.delete(data._id)}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>

          </Box>
        </Box>
      </Card>

    </Grid>
  )
}

export default ListIndexItem