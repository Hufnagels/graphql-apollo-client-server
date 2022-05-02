import React, { memo } from 'react'
import { useLazyQuery, } from "@apollo/client";
import { Link, useLocation } from "react-router-dom"
import _ from "lodash"

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
} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell';
import { useTheme, styled } from '@mui/material/styles';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// Custom
import ListIndexItem from './ListIndexItem';
import { GET_USERS } from "../../app/queries";
import Add from './Add';
import SearchBar from '../Layout/SearchBar';

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
  const theme = useTheme();

  const [title, setTitle] = React.useState(_.capitalize(location.pathname.slice(location.pathname.lastIndexOf("/") + 1, location.pathname.length)) + ' list')
  const [openDialog, setOpenDialog] = React.useState(false)
  const [search, setSearch] = React.useState(null)

  const [users, setUsers] = React.useState([])

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
    }
  })

  React.useEffect(() => {
    //console.log('ListIndex --> search useEffect #1', page, perpage, totalpage, data)
    if (!data) return
    if (!(typeof data.getUsers === 'undefined')) return
    setUsers(data.getUsers.users)
    setTotalPage(data.getUsers.totalPages)
    setCount(data.getUsers.count)
    if (data.getUsers.users.length > 0)
      setVisiblePN(true)
    else
      setVisiblePN(false)
  }, [data])

  React.useEffect(() => {
    //console.log('ListIndex --> search useEffect #2', page, perpage, totalpage, data)
    //if (!page) return
    fetchFilteredUsers({
      variables: {
        search,
        page: page,
        limit: perpage
      }
    }).then((res) => {
      //console.log('res', res)
      setUsers(res.data.getUsers.users)
      setTotalPage(res.data.getUsers.totalPages)
      setPage(res.data.getUsers.currentPage)
      setCount(res.data.getUsers.count)
    }).catch((err) => {
      //console.log('err', err)
    })
    //if (!search) return

  }, [search/*,  page, perpage, totalpage, users*/])

  if (loading) return <CircularProgress color="secondary" />

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
          setData={setUsers}
          visiblePN={false}
          refetch={refetch}
          active={openDialog}
          setOpenDialog={setOpenDialog}
          addComponent={
            <Add onClick={setOpenDialog} active={openDialog} refetch={refetch} setUsers={setUsers} />
          }
        />
        {error && <Alert severity="warning">{JSON.stringify(error, null, 2)}</Alert>}
        {users && !error && <React.Fragment>
          <TableContainer component={Paper} sx={{ maxHeight: 590 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
              <TableHead>
                <TableRow>
                  {/* <StyledTableCell align="left">Username</StyledTableCell> */}
                  <StyledTableCell align="left">Email</StyledTableCell>
                  <StyledTableCell align="left">Date</StyledTableCell>
                  <StyledTableCell align="left">First name</StyledTableCell>
                  <StyledTableCell align="left">Last name</StyledTableCell>
                  <StyledTableCell align="right">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((row) => (
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
                        <Link to={"/app/users/" + row._id} key={"edit_" + row._id}><EditOutlinedIcon fontSize="small" /></Link><Divider orientation="vertical" flexItem />
                        <Link to={"/app/users/" + row._id} key={"preview_" + row._id}><PreviewOutlinedIcon fontSize="small" /></Link><Divider orientation="vertical" flexItem />
                        <Link to={"/app/users/" + row._id} key={"delete_" + row._id}><DeleteOutlineOutlinedIcon fontSize="small" /></Link>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow>
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