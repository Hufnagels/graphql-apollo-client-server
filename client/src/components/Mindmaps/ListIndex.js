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
import { GET_MINDMAPS, DELETE_MINDMAP } from "../../app/queries";
import Add from './Add';

import SearchBar from '../Layout/SearchBar';
import { makeListTitleFromPath } from '../../app/functions/text'
import { LIMIT } from '../Layout/Pagination.options'

const GET_RECORDS = GET_MINDMAPS
//const UPDATE_RECORD = 
const DELETE_RECORD = DELETE_MINDMAP

const ListIndex = () => {
  const { user } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const [title, setTitle] = React.useState(makeListTitleFromPath(location.pathname) + ' list')

  const theme = useTheme();
  const [openAddDialog, setOpenAddDialog] = React.useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false)
  const [updateData, setUpdateData] = React.useState(null)

  // Return from backend
  // count: 9
  // currentPage: 1
  // totalPages: 5
  // files: (2)
  const [count, setCount] = React.useState(0)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalpage, setTotalPage] = React.useState(1)
  const [records, setRecords] = React.useState([])

  const [search, setSearch] = React.useState(null)
  const [limit, setLimit] = React.useState(LIMIT)

  const [dialogVisibility, setDialogVisibility] = React.useState(false)

  const prevStateRef = React.useRef()
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [fetchFilteredRecords, { data, loading, error, refetch }] = useLazyQuery(GET_RECORDS, {
    // const { data, loading, error, refetch } = useQuery(GET_RECORDS, {
    variables: {
      search,
      page: currentPage,
      limit: limit
    },
    fetchPolicy: 'no-cache', //'cache-and-network', //'no-cache', //'cache-and-network', //
    onCompleted: ({ getMindmaps }) => {
      const response = getMindmaps
      const responseData = getMindmaps?.mindmaps
      console.log('useQuery(GET_RECORDS) onCompleted:', response)

      setUpdateData(null)
      setRecords([])
      setRecords(responseData)
      setTotalPage(response.totalPages)
      setCount(response.count)

      if (responseData.length > 0)
        setDialogVisibility(true)
      else
        setDialogVisibility(false)
    },
    onError: (error) => {
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  }
  )
  const refetchQuery = () => {
    console.log('Files refetchQuery')
    setUpdateData(null)
    //setRecords([])
    refetch()

  }
  const [deleteRecord] = useMutation(DELETE_RECORD, {
    onCompleted: () => {
      console.log('deleteRecord')
      //fetchFilteredRecords()
      refetchQuery()
    },
    onError: (error) => {
      console.log(error)
    }
  })
  const deleteItem = (idx) => {
    console.log('deleteItem', idx)
    deleteRecord({
      variables: {
        id: idx
      }
    })
  }
  const editItem = (idx) => {
    console.log('editItem', idx)
    console.log('editItem', records)
    const item = findRecordByIdInRecords(idx)
    setUpdateData(item)
    setOpenUpdateDialog(true)

  }
  const handleUpdateFiles = (index, item) => {
    const newRecords = [...records];
    newRecords.splice(index, 1)
    newRecords.unshift(item)
    console.log('newRecords', newRecords)
    setRecords(newRecords)
    // setRecords({...files})
    forceUpdate()
    //if (prevStateRef.current !== newRecords) refetch()
  }

  // Child components functions
  const handlePageChange = page => {
    console.log('handlePageChange', page, limit)
    setCurrentPage(page)
    fetchFilteredRecords({
      variables: {
        search,
        page: page,
        limit: limit
      }
    })
  }
  const handleLimitChange = e => {
    console.log('handleLimitChange', e.target.value)
    setLimit(e.target.value)
  }

  // Common functions
  const findIndexInRecords = id => {
    var index = records.findIndex(x => x._id === id);
    //console.log('updated index, state', index, records)
    if (index === -1) {
      // console.log('updateItem Not in list', id, updatedItem)
      return null
    } else {
      return index
    }
  }
  const findRecordByIdInRecords = id => {
    var index = records.findIndex(x => x._id === id);
    //console.log('updated index, state', index, records)
    if (index === -1) {
      // console.log('updateItem Not in list', id, updatedItem)
      return null
    } else {
      return records[index]
    }
  }

  React.useEffect(() => {
    //console.log('React.useEffect', currentPage, limit)
    fetchFilteredRecords({
      variables: {
        search,
        page: currentPage,
        limit: limit
      }
    })
  }, [limit])

  if (loading) return <React.Fragment><CircularProgress color="secondary" />Loading....</React.Fragment>

  return (
    <React.Fragment>
      <Box style={{ padding: '0rem' }}>
        <SearchBar
          title={title}
          data={records}
          recordCount={count}

          search={search}
          setSearch={setSearch}

          currentPage={currentPage}
          displayItemPerPage={limit}
          setDisplayItemPerPage={setLimit}

          handlePaginationChange={handlePageChange}
          handleLimitChange={handleLimitChange}

          // refetch={refetchQuery}

          active={openAddDialog}
          setOpenDialog={setOpenAddDialog}
          addComponent={
            <Add
              onClick={setOpenAddDialog}
              active={openAddDialog}
              refetch={refetchQuery}
              data={records}
              setData={setRecords}
              owner={user.lastName}
            />
          }
        />
        <Grid container spacing={{ sm: 1, md: 1 }} >
          {error && <Alert severity="warning">{JSON.stringify(error, null, 2)}</Alert>}
          {records.length === 0 && <Grid item sx={{ width: '100%' }}><Alert severity="info">No records found</Alert></Grid>}
          {records && records.map((record) => {
            return <ListIndexItem data={record} key={record._id} delete={deleteItem} edit={editItem} />
          })}
        </Grid>

      </Box>
    </React.Fragment>
  )
}

export default ListIndex