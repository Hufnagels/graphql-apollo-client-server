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
import {GET_MINDMAPS} from "../../app/queries";
import Add from './Add';
import SearchBar from '../Layout/SearchBar';

const ListIndex = () => {
  const location = useLocation();
  
  const theme = useTheme();
  const [title, setTitle] = React.useState(_.capitalize(location.pathname.slice(location.pathname.lastIndexOf("/") + 1, location.pathname.length)) + ' list')
  const [openDialog, setOpenDialog] = React.useState(false)
  const [search,setSearch] = React.useState(null)

  const [mindmaps,setMindmaps] = React.useState({data:[]})

  const [page, setPage] = React.useState(1);
  const [totalpage, setTotalPage] = React.useState(1)
  const [perpage, setPerpage] = React.useState(10)
  const [count, setCount] = React.useState(0)
  const [visiblePN, setVisiblePN] = React.useState(false)

  const [
    fetchFilteredMindmaps,
    {data, loading, error, refetch}
  ] = useLazyQuery(GET_MINDMAPS, {
    variables:{
      search,
      page:page,
      limit:perpage
    },
    onCompleted: ({ getMindmaps }) => {
      console.log('getMindmaps', getMindmaps)
      setMindmaps({
        ...mindmaps,
        data: getMindmaps.mindmaps
      })
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
  })

  React.useEffect(() => {
    fetchFilteredMindmaps()
  },[data])

  if (loading) return <CircularProgress color="secondary" />

  return (
    <React.Fragment>
      <Box style={{padding:'0rem'}}>
        <SearchBar
          title={title}
          fn={fetchFilteredMindmaps}
          search={search}
          setSearch={setSearch}
          page={page} 
          setPage={setPage}
          perpage={perpage}
          setPerpage={setPerpage}
          totalpage={totalpage}
          setData={setMindmaps}
          visiblePN={visiblePN}
          refetch={refetch}
          active={openDialog}
          setOpenDialog={setOpenDialog}
          addComponent={
            <Add onClick={setOpenDialog} active={openDialog} refetch={refetch} setData={setMindmaps} />
          }
        />
        <Grid container spacing={{ sm: 1, md: 1 }} >
          {mindmaps.data && mindmaps.data.map((mindmap, idx) => {
            return <ListIndexItem data={mindmap} key={idx} />
          })}
        </Grid>
      </Box>
    </React.Fragment>
  )
}

export default memo(ListIndex)