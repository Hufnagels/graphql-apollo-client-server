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
import { GET_BOARDS, DELETE_BOARD, UPDATE_BOARD } from "../../app/queries";
import Add from './Add';
import Update from './UpdateItem'
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

  const [boards, setBoards] = React.useState([])

  const [page, setPage] = React.useState(1);
  const [totalpage, setTotalPage] = React.useState(1)
  const [perpage, setPerpage] = React.useState(10)
  const [count, setCount] = React.useState(0)
  const [visiblePN, setVisiblePN] = React.useState(false)

  const prevStateRef = React.useRef()
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  //const [fetchFilteredBoards, { data, loading, error, refetch }] = useLazyQuery(
  const { data, loading, error, refetch } = useQuery(GET_BOARDS, {
    variables: {
      search,
      page: page,
      limit: perpage
    },
    //fetchPolicy: 'no-cache', //'cache-and-network', //'no-cache', //'cache-and-network', //
    onCompleted: ({ getBoards }) => {
      console.log('useQuery(GET_BOARDS) onCompleted:', getBoards)
      setUpdateData(null)
      setBoards([])
      // prevStateRef.current = getBoards.boards
      setBoards(getBoards.boards)
      setTotalPage(getBoards.totalPages)
      setCount(getBoards.count)

      if (getBoards.boards.length > 0)
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
    //       const index = findIndexInBoards(idx)
    //       handleUpdateBoards(index, data.updateBoard)
    //     },
    onCompleted: async ({ updateBoard }) => {

      const idx = updateBoard._id
      const index = findIndexInBoards(idx)
      console.log('onCompleted', idx, index)
      console.log('updateBoard completed', updateBoard)
      // boards[index] = updateBoard

      setOpenUpdateDialog(false)
      setUpdateData(null)
      const variant = 'success'
      enqueueSnackbar(' created successfully', { variant })
      refetchQuery()
      // await handleUpdateBoards(index, updateBoard)
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

  const [deleteBoard] = useMutation(DELETE_BOARD, {
    onCompleted: () => {
      console.log('deleteBoard')
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
    console.log('Whiteboard refetchQuery')
    setUpdateData(null)
    setBoards([])
    refetch()

  }

  const editItem = (idx) => {
    console.log('editItem', idx)
    console.log('editItem', boards)
    const item = findBoardItemByIdInBoards(idx)
    setUpdateData(item)
    setOpenUpdateDialog(true)

  }
  const handleUpdateBoards = (index, item) => {
    const newBoards = [...boards];
    newBoards.splice(index, 1)
    newBoards.unshift(item)
    console.log('newBoards', newBoards)
    setBoards(newBoards)
    // setBoards({...boards})
    forceUpdate()
    //if (prevStateRef.current !== newBoards) refetch()
  }

  const findIndexInBoards = (id) => {
    var index = boards.findIndex(x => x._id === id);
    //console.log('updated index, state', index, boards)
    if (index === -1) {
      // console.log('updateItem Not in list', id, updatedItem)
      return null
    } else {
      return index
    }
  }
  const findBoardItemByIdInBoards = (id) => {
    var index = boards.findIndex(x => x._id === id);
    //console.log('updated index, state', index, boards)
    if (index === -1) {
      // console.log('updateItem Not in list', id, updatedItem)
      return null
    } else {
      return boards[index]
    }
  }


  // React.useEffect(() => {
  //   if (!data) return

  //   setBoards(data.getBoards.boards)
  //     setTotalPage(data.getBoards.totalPages)
  //     setCount(data.getBoards.count)

  //     if (data.getBoards.boards.length > 0)
  //       setVisiblePN(true)
  //     else
  //       setVisiblePN(false)
  //   return () => setBoards([])
  // }, [data])
  //   React.useEffect(() => {
  //     if (boards.length === 0) return
  // console.log('boards updated')
  //     return () => {
  //       //setBoards({data: []})
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
          data={boards}
          setData={setBoards}
          visiblePN={visiblePN}
          refetch={refetchQuery}
          active={openAddDialog}
          setOpenDialog={setOpenAddDialog}
          addComponent={
            <Add onClick={setOpenAddDialog} active={openAddDialog} refetch={refetchQuery} data={boards} setData={setBoards} owner={user.lastname} />
          }
        />
        <Grid container spacing={{ sm: 1, md: 1 }} >
          {error && <Alert severity="warning">{JSON.stringify(error, null, 2)}</Alert>}
          {boards && boards.map((board) => {
            return <ListIndexItem data={board} key={board._id} delete={deleteItem} edit={editItem} />
          })}
        </Grid>
        {boards && <Update onClick={setOpenUpdateDialog} active={openUpdateDialog} updateBoard={updateBoard} refetch={refetchQuery} data={updateData} setData={setBoards} />}
      </Box>
    </React.Fragment>
  )
}

export default ListIndex