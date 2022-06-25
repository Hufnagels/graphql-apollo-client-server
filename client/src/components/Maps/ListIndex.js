import React, { memo } from 'react'
import {
  useQuery,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { useLocation } from "react-router-dom"
import _ from "lodash"
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
import { GET_MAPS, DELETE_MAP } from "../../app/queries";
import Add from './Add';
import SearchBar from '../Layout/SearchBar';
import { makeListTitleFromPath } from '../../app/functions/text'

const ListIndex = () => {
  const { isLoggedIn, user, tokens } = useSelector((state) => state.auth);
  const location = useLocation();
  const [title, setTitle] = React.useState(makeListTitleFromPath(location.pathname) + ' list')

  const theme = useTheme();

  const [openDialog, setOpenDialog] = React.useState(false)
  const [search, setSearch] = React.useState(null)

  const [maps, setMaps] = React.useState([])

  const [page, setPage] = React.useState(1);
  const [totalpage, setTotalPage] = React.useState(1)
  const [perpage, setPerpage] = React.useState(10)
  const [count, setCount] = React.useState(0)
  const [visiblePN, setVisiblePN] = React.useState(false)

  // const [ fetchFilteredMaps, { data, loading, error, refetch } ] = useLazyQuery(
  const { data, loading, error, refetch } = useQuery(GET_MAPS,
    {
      variables: {
        search,
        page: page,
        limit: perpage
      },
      onCompleted: ({ getMaps }) => {
        console.log('useQuery(GET_MAPS) onCompleted:', getMaps)
        const newData = getMaps.maps
        setMaps(newData)
        setTotalPage(getMaps.totalPages)
        setCount(getMaps.count)
        if (getMaps.maps.length > 0)
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

  const [deleteMap] = useMutation(DELETE_MAP, {
    onCompleted: () => {
      console.log('deleteMap')
      //fetchFilteredBoards()
      refetchQuery()
    },
    onError: (error) => {
      console.log(error)
    }
  })
  const deleteItem = (idx) => {
    console.log(idx)
    deleteMap({
      variables: {
        id: idx
      }
    })
  }
  const refetchQuery = () => {
    console.log('deleteMap refetchQuery')
    refetch()
  }
  React.useEffect(() => {
    if (!data) return
    setMaps(data.getMaps?.maps)
    setTotalPage(data.getMaps.totalPages)
    setCount(data.getMaps.count)
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
          //fn={fetchFilteredMaps}
          search={search}
          setSearch={setSearch}
          page={page}
          setPage={setPage}
          perpage={perpage}
          setPerpage={setPerpage}
          totalpage={totalpage}
          data={maps}
          setData={setMaps}
          visiblePN={visiblePN}
          refetch={refetchQuery}
          active={openDialog}
          setOpenDialog={setOpenDialog}
          addComponent={
            <Add onClick={setOpenDialog} active={openDialog} refetch={refetchQuery} data={maps} setData={setMaps} owner={user.lastName} />
          }
        />
        <Grid container spacing={{ sm: 1, md: 1 }} >
          {error && <Alert severity="warning"> No maps were found </Alert>}
          {maps && maps.map((map, idx) => {
            return <ListIndexItem data={map} key={map._id} title={map.title} delete={deleteItem} />
          })}
        </Grid>
      </Box>
    </React.Fragment>
  )
}

export default memo(ListIndex)