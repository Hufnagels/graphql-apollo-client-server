import React, { memo } from 'react'
import { useLazyQuery, } from "@apollo/client";
import { useLocation } from "react-router-dom"
import _ from "lodash"

// Material
import {
  Box,
  Grid,
  CircularProgress,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';

// Custom
import ListIndexItem from './ListIndexItem';
import { GET_BOARDS } from "../../app/queries";
import Add from './Add';
import SearchBar from '../Layout/SearchBar';
import { makeListTitleFromPath } from '../../app/functions/text'

const ListIndex = () => {
  const location = useLocation();
  const [title, setTitle] = React.useState(makeListTitleFromPath(location.pathname) + ' list')

  const theme = useTheme();
  const [openDialog, setOpenDialog] = React.useState(false)
  const [search, setSearch] = React.useState(null)

  const [boards, setBoards] = React.useState({ data: [] })

  const [page, setPage] = React.useState(1);
  const [totalpage, setTotalPage] = React.useState(1)
  const [perpage, setPerpage] = React.useState(10)
  const [count, setCount] = React.useState(0)
  const [visiblePN, setVisiblePN] = React.useState(false)

  const [
    fetchFilteredBoards,
    { data, loading, error, refetch }
  ] = useLazyQuery(GET_BOARDS, {
    variables: {
      search,
      page: page,
      limit: perpage
    },
    onCompleted: ({ getBoards }) => {
      console.log('getBoards', getBoards)
      setBoards({
        ...boards,
        data: getBoards.boards
      })
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
  })

  React.useEffect(() => {
    fetchFilteredBoards()
  }, [data])

  if (loading) return <React.Fragment><CircularProgress color="secondary" />Loading....</React.Fragment>

  return (
    <React.Fragment>
      <Box style={{ padding: '0rem' }}>
        <SearchBar
          title={title}
          fn={fetchFilteredBoards}
          search={search}
          setSearch={setSearch}
          page={page}
          setPage={setPage}
          perpage={perpage}
          setPerpage={setPerpage}
          totalpage={totalpage}
          setData={setBoards}
          visiblePN={visiblePN}
          refetch={refetch}
          active={openDialog}
          setOpenDialog={setOpenDialog}
          addComponent={
            <Add onClick={setOpenDialog} active={openDialog} refetch={refetch} setData={setBoards} />
          }
        />
        <Grid container spacing={{ sm: 1, md: 1 }} >
          {boards.data && boards.data.map((board, idx) => {
            return <ListIndexItem data={board} key={idx} />
          })}
        </Grid>
      </Box>
    </React.Fragment>
  )
}

export default memo(ListIndex)