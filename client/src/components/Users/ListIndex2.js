import React from 'react'
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
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

import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// Custom
import { GET_USERS, DELETE_USER } from "../../app/queries";
import Add from './Add';
import ListIndexItem2 from './ListIndexItem2'
import ListIndexItem3 from './ListIndexItem3'

import SearchBar from '../Layout/SearchBar';
import { makeListTitleFromPath } from '../../app/functions/text'
import { LIMIT } from '../Layout/Pagination.options'


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

  const [users, setUsers] = React.useState([])

  const [page, setPage] = React.useState(1);
  const [totalpage, setTotalPage] = React.useState(1)
  const [perpage, setPerpage] = React.useState(LIMIT)
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
  const { data, loading, error, refetch } = useQuery(GET_USERS,
    {
      variables: {
        search,
        page: page,
        limit: perpage
      },
      fetchPolicy: 'no-cache',
      onCompleted: ({ getUsers }) => {
        console.log('useQuery(GET_USERS) onCompleted:', getUsers)
        const newData = getUsers.users
        setUsers(newData)
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
    }
  )

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      console.log('deleteUser')
      refetchQuery()
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
  const refetchQuery = () => {
    console.log('Users refetchQuery')
    refetch()
  }
  React.useEffect(() => {
    if (!data) return
    setUsers(data.getUsers?.users)
    return () => {
      //setBoards({data: []})
    }
  }, [data])

  if (loading) return <React.Fragment><CircularProgress color="secondary" />Loading....</React.Fragment>
  //return null
  return (
    <React.Fragment>
      <Box style={{ padding: '0rem' }}>
        <SearchBar
          customPagination={true}
          title={title}
          data={users}
          recordCount={count}

          search={search}
          setSearch={setSearch}

          // page={page}
          // setPage={setPage}
          // perpage={perpage}
          // setPerpage={setPerpage}
          // totalpage={totalpage}

          // setData={setUsers}
          // visiblePN={false}
          refetch={refetchQuery}

          active={openDialog}
          setOpenDialog={setOpenDialog}
          addComponent={
            <Add onClick={setOpenDialog} active={openDialog} refetch={refetchQuery} data={users} setData={setUsers} />
          }
        />
        {error && <Alert severity="warning">{JSON.stringify(error, null, 2)}</Alert>}
        {users &&
          <ListIndexItem3
            data={users}
            delete={deleteItem}
            count={count}
            rowsPerPage={perpage}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        }

        {users && error && <React.Fragment>
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
                {users && users.map((row) => (
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
                        <Link to={"/app/users/" + row._id} key={"edit_" + row._id}>
                          <IconButton>
                            <ModeEditOutlineOutlinedIcon fontSize="medium" />
                          </IconButton><Divider orientation="vertical" flexItem />
                        </Link>
                        <Link to={"/app/users/" + row._id} key={"preview_" + row._id}>
                          <IconButton>
                            <VisibilityOutlinedIcon fontSize="medium" />
                          </IconButton>
                        </Link>
                        <Divider orientation="vertical" flexItem />
                        <IconButton onClick={(e) => deleteItem(row._id)} key={"delete_" + row._id}>
                          <DeleteOutlineOutlinedIcon fontSize="medium" />
                        </IconButton>
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