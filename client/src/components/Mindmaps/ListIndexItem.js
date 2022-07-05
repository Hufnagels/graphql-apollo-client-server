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
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// Custom
import { formatTimeToCurrentTimeZone } from '../../app/functions/time'
import { stringToColor } from '../../app/functions/color'

const ListIndexItem = (props) => {
  //console.log('ListIndexItem',props)
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
      <Card elevation={1} square={true}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: stringToColor(data.owner) }}
              aria-label="recipe"
              alt={data.owner}
              variant="square"

            >
              {data.owner.charAt(0)}
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
          <MenuItem onClick={handleClose}><Link to={window.location.pathname + "/" + data._id} key={"mindmap_o_key_" + data._id}>Open</Link></MenuItem>
          <MenuItem onClick={handleClose}><Link to={window.location.pathname + "/preview/" + data._id} key={"mindmap_p_key_" + data._id}>Preview</Link></MenuItem>
          <Divider />
          <MenuItem onClick={() => props.delete(data._id)}>Delete</MenuItem>

        </Menu>
        {data.mapimage ?
          <CardMedia
            component="img"
            height="140"
            image={data.mapimage}
            alt="green iguana"
          />
          :
          <Skeleton variant="rectangular" height={140} />
        }
        <CardContent >
          <Typography
            variant="body2"
            component="span"
            sx={{
              display: 'inline-block',
              width: '100%',
              whiteSpace: 'nowrap',
              overflow: 'hidden !important',
              textOverflow: 'ellipsis',
            }}
          >
            {data.description}
          </Typography>
        </CardContent>
        <Divider />
        <CardActions
          disableSpacing
          style={{
            backgroundColor: theme.palette.custom.light,
          }}
        >
          <Link to={window.location.pathname + "/" + data._id} key={"mindmap_key_" + data._id}>
            <IconButton aria-label="open data">
              <ModeEditOutlineOutlinedIcon />
            </IconButton>
          </Link>
          <IconButton aria-label="preview mindmap">
            <VisibilityOutlinedIcon />
          </IconButton>
          <IconButton aria-label="delete mindmap" onClick={() => props.delete(data._id)}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default ListIndexItem