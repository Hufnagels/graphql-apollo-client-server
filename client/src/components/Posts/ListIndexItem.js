import React from 'react'
import { Link, useParams } from "react-router-dom";

// Material
import {
  Avatar,
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
import { red } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// Custom
import { formatTimeToCurrentTimeZone } from '../../app/functions/time'
import { stringToColor } from '../../app/functions/color'

const ListIndexItem = (props) => {
  // console.log(props)
  const theme = useTheme();
  const [data, setData] = React.useState(props.data)
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
      <Card variant="outlined" >
        <CardHeader
          avatar={
            <Avatar
            sx={{ bgcolor: stringToColor(data.author) }}
            aria-label="recipe"
            alt={data.author}
            variant="square"

          >
            {data.author.charAt(0)}
          </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          }
          title={data.title}
          subheader={formatTimeToCurrentTimeZone(data.createdAt, 'hu-HU')}
        />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}><Link to={window.location.pathname + "/" + data._id} key={"mapkey_" + data._id}>Open</Link></MenuItem>
          <MenuItem onClick={handleClose}><Link to={window.location.pathname + "/" + data._id + "/preview"} key={"mapkey_" + data._id}>Preview</Link></MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>Delete</MenuItem>

        </Menu>
        {data.titleimage ?
          <CardMedia
            component="img"
            height="140"
            image={data.titleimage}
            alt="green iguana"
          />
          :
          <Skeleton variant="rectangular" height={140} />
        }
        <CardContent >
          <Typography variant="body2" component="div">
            {data.subtitle}
          </Typography>
        </CardContent>
        <Divider />
        <CardActions
          disableSpacing
          style={{
            backgroundColor: theme.palette.custom.light,
          }}
        >
          <IconButton aria-label="open data">
            <FileOpenOutlinedIcon />
          </IconButton>
          <IconButton aria-label="preview board">
            <VisibilityOutlinedIcon />
          </IconButton>
          <IconButton aria-label="delete board">
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default ListIndexItem