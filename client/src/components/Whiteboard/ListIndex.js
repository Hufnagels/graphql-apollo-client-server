import React, { memo } from 'react'
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { useLocation } from "react-router-dom"
import _ from "lodash"

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
import { GET_BOARDS, DELETE_BOARD } from "../../app/queries";
import Add from './Add';
import SearchBar from '../Layout/SearchBar';
import { makeListTitleFromPath } from '../../app/functions/text'

const ListIndex = () => {
  const location = useLocation();
  const [title, setTitle] = React.useState(makeListTitleFromPath(location.pathname) + ' list')

  const theme = useTheme();
  const [openDialog, setOpenDialog] = React.useState(false)
  const [search, setSearch] = React.useState(null)

  const [boards, setBoards] = React.useState([])

  const [page, setPage] = React.useState(1);
  const [totalpage, setTotalPage] = React.useState(1)
  const [perpage, setPerpage] = React.useState(10)
  const [count, setCount] = React.useState(0)
  const [visiblePN, setVisiblePN] = React.useState(false)

  //const [fetchFilteredBoards, { data, loading, error, refetch }] = useLazyQuery(
  const { data, loading, error, refetch } = useQuery(
    GET_BOARDS,
    {
      variables: {
        search,
        page: page,
        limit: perpage
      },
      onCompleted: ({ getBoards }) => {
        console.log('getBoards', getBoards)
        const newData = getBoards.boards
        // setBoards({
        //   //...boards,
        //   data: getBoards.boards
        // })
        setBoards(newData)
          
        setTotalPage(getBoards.totalPages)
        setCount(getBoards.count)
        if (getBoards.boards.length > 0)
          setVisiblePN(true)
        else
          setVisiblePN(false)
      },
      onError: (error) => {
        const variant = 'error'
        //enqueueSnackbar(error.message, { variant })
      }
    }
  )
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
    console.log(idx)
    deleteBoard({
      variables: {
        id: idx
      }
    })
  }
  const refetchQuery = () => {
    console.log('Whiteboard refetchQuery')
    refetch()
  }
  React.useEffect(() => {
    if (!data) return
    setBoards(data.getBoards?.boards)
    return () => {
      //setBoards({data: []})
    }
  }, [data])

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
          active={openDialog}
          setOpenDialog={setOpenDialog}
          addComponent={
            <Add onClick={setOpenDialog} active={openDialog} refetch={refetchQuery} data={boards} setData={setBoards} />
          }
        />
        <Grid container spacing={{ sm: 1, md: 1 }} >
          {error && <Alert severity="warning">{JSON.stringify(error, null, 2)}</Alert>}
          {boards && boards.map((board, idx) => {
            return <ListIndexItem data={board} key={board._id} delete={deleteItem}/>
          })}
        </Grid>
      </Box>
    </React.Fragment>
  )
}

export default memo(ListIndex)