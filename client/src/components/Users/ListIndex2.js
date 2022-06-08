import React from 'react'
import { useLazyQuery, useMutation } from "@apollo/client";
import { Link, useLocation } from "react-router-dom"

// Material
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  Divider,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  IconButton,
} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// Custom
import { GET_USERS, DELETE_USER } from "../../app/queries";
import Add from './Add';
import SearchBar from '../Layout/SearchBar';
import { makeListTitleFromPath } from '../../app/functions/text'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.custom.light,
    color: theme.palette.custom.dark,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const ListIndex2 = () => {
  const location = useLocation();
  const [title, setTitle] = React.useState(makeListTitleFromPath(location.pathname) + ' list')
  const [openDialog, setOpenDialog] = React.useState(false)
  const [search, setSearch] = React.useState(null)

  const [users, setUsers] = React.useState({ data: [] })

  const [page, setPage] = React.useState(1);
  const [totalpage, setTotalPage] = React.useState(1)
  const [perpage, setPerpage] = React.useState(10)
  const [count, setCount] = React.useState(0)
  const [visiblePN, setVisiblePN] = React.useState(false)

  const handleChangePage = (event, newPage) => {
    //console.log('handleChangePage',event, newPage)
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPerpage(+event.target.value);
    setPage(1);
  };

  const [
    fetchFilteredUsers,
    { data, loading, error, refetch }
  ] = useLazyQuery(GET_USERS, {
    variables: {
      search,
      page: page,
      limit: perpage
    },
    onCompleted: ({ getUsers }) => {
      // ('getUsers', getUsers)
      setUsers({
        ...users,
        data: getUsers.users
      })
      setTotalPage(getUsers.totalPages)
      setCount(getUsers.count)
      if (getUsers.users.length > 0)
        setVisiblePN(true)
      else
        setVisiblePN(false)
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      console.log('deleteUser')
      fetchFilteredUsers()
    },
    onError: (error) => {
      console.log(error)
    }
  })
  const deleteItem = (idx) => {
    console.log(idx)
    deleteUser({
      variables: {
        id: idx
      }
    })
  }
  React.useEffect(() => {
    fetchFilteredUsers()
    console.dir('Listindex2 useEffect data change', data)
  }, [])

  if (loading) return <React.Fragment><CircularProgress color="secondary" />Loading....</React.Fragment>
  //return null
  return (
    <React.Fragment>
      <Box style={{ padding: '0rem' }}>
        <SearchBar
          title={title}
          fn={fetchFilteredUsers}
          search={search}
          setSearch={setSearch}
          page={page}
          setPage={setPage}
          perpage={perpage}
          setPerpage={setPerpage}
          totalpage={totalpage}
          data={users}
          setData={setUsers}
          visiblePN={false}
          refetch={refetch}
          active={openDialog}
          setOpenDialog={setOpenDialog}
          addComponent={
            <Add onClick={setOpenDialog} active={openDialog} refetch={refetch} users={users} setUsers={setUsers} />
          }
        />
        {error && <Alert severity="warning">{JSON.stringify(error, null, 2)}</Alert>}
        {users.data && !error && <React.Fragment>
          <TableContainer component={Paper} sx={{ maxHeight: 590 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
              <TableHead>
                <TableRow key='headerrow'>
                  {/* <StyledTableCell align="left">Username</StyledTableCell> */}
                  <StyledTableCell align="left">Email</StyledTableCell>
                  <StyledTableCell align="left">Date</StyledTableCell>
                  <StyledTableCell align="left">First name</StyledTableCell>
                  <StyledTableCell align="left">Last name</StyledTableCell>
                  <StyledTableCell align="right">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.data && users.data.map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {/* <TableCell align="left">{row.username}</TableCell> */}
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">{row.date_of_birth}</TableCell>
                    <TableCell align="left">{row.firstName}</TableCell>
                    <TableCell align="left">{row.lastName}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} style={{ justifyContent: 'flex-end' }}>
                        <IconButton><Link to={"/app/users/" + row._id} key={"edit_" + row._id}><EditOutlinedIcon fontSize="small" /></Link></IconButton><Divider orientation="vertical" flexItem />
                        <IconButton><Link to={"/app/users/" + row._id} key={"preview_" + row._id}><PreviewOutlinedIcon fontSize="small" /></Link></IconButton><Divider orientation="vertical" flexItem />
                        <IconButton onClick={(e) => deleteItem(row._id)} key={"delete_" + row._id}><DeleteOutlineOutlinedIcon fontSize="small" /></IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow key='footerrow'>
                  {/* <StyledTableCell align="left">Username</StyledTableCell> */}
                  <StyledTableCell align="left">Email</StyledTableCell>
                  <StyledTableCell align="left">Date</StyledTableCell>
                  <StyledTableCell align="left">First name</StyledTableCell>
                  <StyledTableCell align="left">Last name</StyledTableCell>
                  <StyledTableCell align="right">Action</StyledTableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[2, 10, 20, 50, 100]}
            component="div"
            count={count}
            rowsPerPage={perpage}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </React.Fragment>}
      </Box>

    </React.Fragment>
  )
}

export default ListIndex2