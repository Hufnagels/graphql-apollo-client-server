import React from 'react'
import { Link } from "react-router-dom";

// Material
import {
  Avatar,
  Grid,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material'
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ListIndexItem = (props) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
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
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" alt={props.title}>{props.title.charAt(0)}</Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon onClick={handleClick} />
            </IconButton>
          }
          title={props.title}
          subheader="September 14, 2016"
        />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}><Link to={window.location.pathname + "/" + props.data._id} key={"mapkey_" + props.data._id}>Open</Link></MenuItem>
          <MenuItem onClick={handleClose}>Preview</MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>Delete</MenuItem>

        </Menu>
        <CardContent>
          <pre>{JSON.stringify(props.data, null, 2)}</pre>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default ListIndexItem