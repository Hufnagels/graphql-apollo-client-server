import React from 'react'
import { useDropzone } from 'react-dropzone'

// Material
import {
  Paper,
  Typography,
} from '@mui/material';

import { NO_IMAGE_SMALL } from '../../app/app.options'

const UploadComponent = props => {
  //const [files, setFiles] = React.useState([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      props.setFiles(acceptedFiles.map(file => {
        console.log('preview', file)
        let preview = null
        if(
          file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" || 
          file.type === "application/zip" || 
          file.type === "text/plain" || 
          file.type === "application/msword" || 
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "application/pdf"
        ) preview = NO_IMAGE_SMALL
        //"application/vnd.openxmlformats-officedocument.presentationml.presentation"
        //"application/zip"
        //"text/plain"
        //"application/msword"
        //"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        //"application/pdf"
        //"image/png" "image/jpg" "image/jpeg"
        else
        preview = URL.createObjectURL(file)
        return Object.assign(file, { preview/* : URL.createObjectURL(file) */ })
      }
      ))
      props.setFieldValue("files", acceptedFiles)
    }
  })
  return (
    <Paper {...getRootProps()}
      className="dropzone"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'stretch',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: '75%',
      }}
      sx={{ p: 2 }}
    >
      <Typography component='div' variant='body2'>
        Drag 'n' drop some files here, or click to select files
      </Typography>
      <input {...getInputProps()} />
    </Paper>
  )
}

export default UploadComponent