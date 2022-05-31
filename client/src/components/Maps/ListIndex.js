import React, { memo } from 'react'
import {
  useQuery,
  useLazyQuery,
} from "@apollo/client";
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
import { GET_MAPS } from "../../app/queries";
import Add from './Add';
import SearchBar from '../Layout/SearchBar';
import { makeListTitleFromPath } from '../../app/functions/text'

const ListIndex = () => {
  // console.log('ListIndex')
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

  const [
    fetchFilteredMaps,
    { data, loading, error, refetch }
  ] = useLazyQuery(GET_MAPS, {
    variables: {
      search,
      page: page,
      limit: perpage
    },
    onCompleted: ({ getMaps }) => {
      // console.log('getMaps', getMaps)
      setMaps({
        ...maps,
        data: getMaps.maps
      })
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
  })

  //////////////////// TEST
  React.useEffect(() => {
    fetchFilteredMaps()
  }, [data])
  ////////////////////

  if (loading) return <React.Fragment><CircularProgress color="secondary" />Loading....</React.Fragment>

  return (
    <React.Fragment>
      <Box style={{ padding: '0rem' }}>
        <SearchBar
          title={title}
          fn={fetchFilteredMaps}
          search={search}
          setSearch={setSearch}
          page={page}
          setPage={setPage}
          perpage={perpage}
          setPerpage={setPerpage}
          totalpage={totalpage}
          setData={setMaps}
          visiblePN={visiblePN}
          refetch={refetch}
          active={openDialog}
          setOpenDialog={setOpenDialog}
          addComponent={
            <Add onClick={setOpenDialog} active={openDialog} refetch={refetch} setMaps={setMaps} />
          }
        />
        <Grid container spacing={{ sm: 1, md: 1 }} >
          {error && <Alert severity="warning"> No maps were found </Alert>}
          {maps.data && maps.data.map((map, idx) => {
            return <ListIndexItem data={map} key={idx} title={map.title} />
          })}
        </Grid>
      </Box>
    </React.Fragment>
  )
}

export default memo(ListIndex)