import React from 'react'
import { useDropzone } from 'react-dropzone'

// Material
import {
  Paper,
  Typography,
} from '@mui/material';


const UploadComponent = props => {
  //const [files, setFiles] = React.useState([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      props.setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })))
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