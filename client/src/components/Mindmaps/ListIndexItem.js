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
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Skeleton,
} from '@mui/material'
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ListIndexItem = (props) => {
  // console.log('ListIndexItem',props.data)
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
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" alt={props.data.title}>{props.data.title.charAt(0)}</Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          }
          title={props.data.title}
          subheader="September 14, 2016"
        />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}><Link to={window.location.pathname + "/" + props.data._id} key={"mapkey_" + props.data._id}>Open</Link></MenuItem>
          <MenuItem onClick={handleClose}><Link to={window.location.pathname + "/preview/" + props.data._id} key={"mapkey_" + props.data._id}>Preview</Link></MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>Delete</MenuItem>

        </Menu>
        {props.data.mapimage ?
          <CardMedia
            component="img"
            height="140"
            image={props.data.mapimage}
            alt="green iguana"
          />
          :
          <Skeleton variant="rectangular" height={140} />
        }
        <CardContent>
          <pre>{JSON.stringify(props.data, null, 2)}</pre>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default ListIndexItem