import React, { memo } from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { useLocation } from "react-router-dom"
import _ from "lodash"
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from "react-redux";

// Material
import {
  Box,
  Grid,
  CircularProgress,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';

// Custom
import ListIndexItem from './ListIndexItem';
import { GET_MINDMAPS, DELETE_MINDMAP } from "../../app/queries";
import Add from './Add';
import SearchBar from '../Layout/SearchBar';
import { makeListTitleFromPath } from '../../app/functions/text'

const ListIndex = () => {
  const { isLoggedIn, user, tokens } = useSelector((state) => state.auth);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = React.useState(makeListTitleFromPath(location.pathname) + ' list')

  const theme = useTheme();
  const [openDialog, setOpenDialog] = React.useState(false)
  const [search, setSearch] = React.useState(null)

  const [mindmaps, setMindmaps] = React.useState([])

  const [page, setPage] = React.useState(1);
  const [totalpage, setTotalPage] = React.useState(1)
  const [perpage, setPerpage] = React.useState(10)
  const [count, setCount] = React.useState(0)
  const [visiblePN, setVisiblePN] = React.useState(false)

  //const [ fetchFilteredMindmaps, { data, loading, error, refetch } ] = useLazyQuery(
  const { data, loading, error, refetch } = useQuery( GET_MINDMAPS,
    {
      variables: {
        search,
        page: page,
        limit: perpage
      },
      onCompleted: ({ getMindmaps }) => {
        console.log('useQuery(GET_MINDMAPS) onCompleted:', getMindmaps)
        const newData = getMindmaps.mindmaps
        setMindmaps(newData)
        setTotalPage(getMindmaps.totalPages)
        setCount(getMindmaps.count)
        if (getMindmaps.mindmaps.length > 0)
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

  const [deleteMindmap] = useMutation(DELETE_MINDMAP, {
    onCompleted: () => {
      console.log('deleteMindmap')
      //fetchFilteredBoards()
      refetchQuery()
    },
    onError: (error) => {
      console.log(error)
    }
  })
  const deleteItem = (idx) => {
    console.log(idx)
    deleteMindmap({
      variables: {
        id: idx
      }
    })
  }
  const refetchQuery = () => {
    console.log('deleteMindmap refetchQuery')
    refetch()
  }
  React.useEffect(() => {
    if (!data) return
    setMindmaps(data.getMindmaps?.mindmaps)
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
          //fn={fetchFilteredMindmaps}
          search={search}
          setSearch={setSearch}
          page={page}
          setPage={setPage}
          perpage={perpage}
          setPerpage={setPerpage}
          totalpage={totalpage}
          data={mindmaps}
          setData={setMindmaps}
          visiblePN={visiblePN}
          refetch={refetchQuery}
          active={openDialog}
          setOpenDialog={setOpenDialog}
          addComponent={
            <Add onClick={setOpenDialog} active={openDialog} refetch={refetchQuery} data={mindmaps} setData={setMindmaps} owner={user.lastName} />
          }
        />
        <Grid container spacing={{ sm: 1, md: 1 }} >
          {mindmaps && mindmaps.map((mindmap, idx) => {
            return <ListIndexItem data={mindmap} key={mindmap._id} delete={deleteItem} />
          })}
        </Grid>
      </Box>
    </React.Fragment>
  )
}

export default memo(ListIndex)