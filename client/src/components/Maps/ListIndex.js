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
import SearchBar from '../Layout/SearchBar';
import { GET_MAPS } from "../../app/queries";
import Add from './Add';

const ListIndex = () => {
  //console.log('ListIndex')
  const location = useLocation();

  const theme = useTheme();
  const [title, setTitle] = React.useState(_.capitalize(location.pathname.slice(location.pathname.lastIndexOf("/") + 1, location.pathname.length)) + ' list')
  const [openDialog, setOpenDialog] = React.useState(false)
  const [search, setSearch] = React.useState(null)

  const [maps, setMaps] = React.useState([])

  const [page, setPage] = React.useState(1);
  const [totalpage, setTotalPage] = React.useState(1)
  const [perpage, setPerpage] = React.useState(10)
  const [visiblePN, setVisiblePN] = React.useState(false)

  const [
    fetchFilteredMaps,
    { data, loading, error, called, refetch }
  ] = useLazyQuery(GET_MAPS, {
    variables: {
      search,
      page: page,
      limit: perpage
    }
  })

  React.useEffect(() => {
    //console.log('ListIndex --> data useEffect')
    if (!data) return
    setMaps(data.getMaps.maps)
    setTotalPage(data.getMaps.totalPages)
    if (data.getMaps.maps.length > 0)
      setVisiblePN(true)
    else
      setVisiblePN(false)
  }, [data])

  //////////////////// TEST
  React.useEffect(() => {
    //console.log('ListIndex --> search useEffect', page, perpage, totalpage, data)
    if (!page) return
    fetchFilteredMaps({
      variables: {
        search,
        page: page,
        limit: perpage
      }
    }).then((res) => {
      //console.log('res', res.data.getMaps)
      if (res.data.getMaps.maps) { }
      setMaps(res.data.getMaps.maps)
      setTotalPage(res.data.getMaps.totalPages)
      setPage(res.data.getMaps.currentPage)
    })

    if (!search) return
    //console.log('search added', search)
    //refetch()
  }, [search, page, perpage, totalpage])
  ////////////////////

  if (loading) return <CircularProgress color="secondary" />

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
          {maps && maps.map((map, idx) => {
            return <ListIndexItem data={map} key={idx} title={map.title} />
          })}
        </Grid>
      </Box>
    </React.Fragment>
  )
}

export default memo(ListIndex)