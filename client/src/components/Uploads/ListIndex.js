import React, { memo } from 'react'
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { useLocation } from "react-router-dom"
import _ from "lodash"
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from "react-redux";

// Material
import {
  Box,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';

// Custom
import ListIndexItem from './ListIndexItem';
import { GET_FILES, DELETE_FILE, UPDATE_BOARD } from "../../app/queries";
import Add from './Add';

import SearchBar from '../Layout/SearchBar';
import { makeListTitleFromPath } from '../../app/functions/text'

const ListIndex = () => {
  const { isLoggedIn, user, tokens } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const [title, setTitle] = React.useState(makeListTitleFromPath(location.pathname) + ' list')

  const theme = useTheme();
  const [openAddDialog, setOpenAddDialog] = React.useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false)
  const [updateData, setUpdateData] = React.useState(null)
  const [search, setSearch] = React.useState(null)

  const [files, setFiles] = React.useState([])

  const [page, setPage] = React.useState(1);
  const [totalpage, setTotalPage] = React.useState(1)
  const [perpage, setPerpage] = React.useState(10)
  const [count, setCount] = React.useState(0)
  const [visiblePN, setVisiblePN] = React.useState(false)

  const prevStateRef = React.useRef()
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  //const [fetchFilteredBoards, { data, loading, error, refetch }] = useLazyQuery(
  const { data, loading, error, refetch } = useQuery(GET_FILES, {
    variables: {
      search,
      page: page,
      limit: perpage
    },
    //fetchPolicy: 'no-cache', //'cache-and-network', //'no-cache', //'cache-and-network', //
    onCompleted: ({ getFiles }) => {
      console.log('useQuery(GET_FILES) onCompleted:', getFiles)
      setUpdateData(null)
      setFiles([])
      // prevStateRef.current = getFiles.files
      setFiles(getFiles.files)
      setTotalPage(getFiles.totalPages)
      setCount(getFiles.count)

      if (getFiles.files.length > 0)
        setVisiblePN(true)
      else
        setVisiblePN(false)
    },
    onError: (error) => {
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  }
  )

  const [updateBoard, { error: updateError }] = useMutation(UPDATE_BOARD, {
    // refetchQueries: [
    //   { query: GET_BOARDS }
    // ],
    //     update (cache, { data }) {
    // console.log('cache', cache)
    // console.log('data', data)
    //       const idx = data.updateBoard?._id
    //       const index = findIndexInFiles(idx)
    //       handleUpdateFiles(index, data.updateBoard)
    //     },
    onCompleted: async ({ updateFile }) => {

      const idx = updateFile._id
      const index = findIndexInFiles(idx)
      console.log('onCompleted', idx, index)
      console.log('updateFile completed', updateFile)
      // boards[index] = updateFile

      setOpenUpdateDialog(false)
      setUpdateData(null)
      const variant = 'success'
      enqueueSnackbar(' created successfully', { variant })
      refetchQuery()
      // await handleUpdateFiles(index, updateFile)
      // setOpenUpdateDialog(false)
      // //const variant = 'success'
      // enqueueSnackbar(' created successfully', { variant })

    },
    onError: (error) => {
      // console.log('CREATE_MINDMAP error', error)
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  });

  const [deleteBoard] = useMutation(DELETE_FILE, {
    onCompleted: () => {
      console.log('deleteFile')
      //fetchFilteredBoards()
      refetchQuery()
    },
    onError: (error) => {
      console.log(error)
    }
  })
  const deleteItem = (idx) => {
    console.log('deleteItem', idx)
    deleteBoard({
      variables: {
        id: idx
      }
    })
  }
  const refetchQuery = () => {
    console.log('Files refetchQuery')
    setUpdateData(null)
    setFiles([])
    refetch()

  }

  const editItem = (idx) => {
    console.log('editItem', idx)
    console.log('editItem', files)
    const item = findBoardItemByIdInFiles(idx)
    setUpdateData(item)
    setOpenUpdateDialog(true)

  }
  const handleUpdateFiles = (index, item) => {
    const newFiles = [...files];
    newFiles.splice(index, 1)
    newFiles.unshift(item)
    console.log('newFiles', newFiles)
    setFiles(newFiles)
    // setFiles({...files})
    forceUpdate()
    //if (prevStateRef.current !== newFiles) refetch()
  }

  const findIndexInFiles = (id) => {
    var index = files.findIndex(x => x._id === id);
    //console.log('updated index, state', index, files)
    if (index === -1) {
      // console.log('updateItem Not in list', id, updatedItem)
      return null
    } else {
      return index
    }
  }
  const findBoardItemByIdInFiles = (id) => {
    var index = files.findIndex(x => x._id === id);
    //console.log('updated index, state', index, files)
    if (index === -1) {
      // console.log('updateItem Not in list', id, updatedItem)
      return null
    } else {
      return files[index]
    }
  }


  // React.useEffect(() => {
  //   if (!data) return

  //   setFiles(data.getFiles.boards)
  //     setTotalPage(data.getFiles.totalPages)
  //     setCount(data.getFiles.count)

  //     if (data.getFiles.boards.length > 0)
  //       setVisiblePN(true)
  //     else
  //       setVisiblePN(false)
  //   return () => setFiles([])
  // }, [data])
  //   React.useEffect(() => {
  //     if (boards.length === 0) return
  // console.log('boards updated')
  //     return () => {
  //       //setFiles({data: []})
  //     }
  //   }, [boards])

  if (loading) return <React.Fragment><CircularProgress color="secondary" />Loading....</React.Fragment>

  return (
    <React.Fragment>
      <Box style={{ padding: '0rem' }}>
        <SearchBar
          title={title}
          //fn={fetchFilteredBoards}
          search={search}
          setSearch={setSearch}
          page={page}
          setPage={setPage}
          perpage={perpage}
          setPerpage={setPerpage}
          totalpage={totalpage}
          data={files}
          setData={setFiles}
          visiblePN={visiblePN}
          refetch={refetchQuery}
          active={openAddDialog}
          setOpenDialog={setOpenAddDialog}
          addComponent={
            <Add onClick={setOpenAddDialog} active={openAddDialog} refetch={refetchQuery} data={files} setData={setFiles} owner={user.lastName} />
          }
        />
        <Grid container spacing={{ sm: 1, md: 1 }} >
          {error && <Alert severity="warning">{JSON.stringify(error, null, 2)}</Alert>}
          {files && files.map((file) => {
            return <ListIndexItem data={file} key={file._id} delete={deleteItem} edit={editItem} />
          })}
        </Grid>

      </Box>
    </React.Fragment>
  )
}

export default ListIndex