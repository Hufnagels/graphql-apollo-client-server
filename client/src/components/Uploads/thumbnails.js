import React from 'react'

// Material
import {
  Alert,
  Icon,
  Typography,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { formatBytes } from '../../app/functions/math'

const Thumbnails = props => {
  if (props.files.length === 0) return <Alert severity="error" sx={{ width: '100%', height: 35 }}>{'No files selected'}</Alert>
  return (
    <ImageList
      sx={{ width: '100%', height: 350 }}
      variant="quilted"
      cols={4}
      rowHeight={201}
      gap={1}
    >
      {props.files && props.files.map((item) => {
        return (
          <ImageListItem
            key={item.name}
            sx={{
              maxWidth: '200px !important',
              maxHeight: '200px !important',
              height: '200px !important',
              backgroundColor: grey[100],
              background: grey[100],
              display: 'flex',
              alignContent: 'center',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              flexWrap: 'nowrap',
            }}
            cols={item.cols || 1} rows={item.rows || 1}

          >
            {!item.preview ? 
            <Icon size="large" component={VisibilityOffIcon} />
            :
            <img
              src={item.preview}
              srcSet={item.preview}
              alt={item.name}
              loading="lazy"
              style={{ maxWidth: '200px !important', maxHeight: '200px !important', objectFit: 'contain' }}
              onLoad={() => { URL.revokeObjectURL(item.preview) }}
            />
            }
            <ImageListItemBar
              title={<Typography component="span" variant="caption">{item.name}</Typography>}
              subtitle={<Typography component="span" variant="caption">{formatBytes(item.size)}</Typography>}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  aria-label={`delete ${item.name}`}
                >
                  <DeleteOutlineOutlinedIcon fontSize="large" />
                </IconButton>
              }
            />
          </ImageListItem>
        )
      })}
    </ImageList>
  )
}

export default Thumbnails