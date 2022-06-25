import React from 'react'
import PropTypes from 'prop-types'
import { Link, } from "react-router-dom"

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


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.custom.light,
    color: theme.palette.custom.dark,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const ListIndexItem2 = props => {
  console.log('ListIndexItem2 props', props)
  const [data, setData] = React.useState(props.items)
  React.useEffect(() => {
    if (!data) return
    setData(props.items)
    return () => {
      //setBoards({data: []})
    }
  }, [data])

  return (
    <React.Fragment>
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
            {data && data.map((row) => (
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
                    <Link to={"/app/props.items/" + row._id} key={"edit_" + row._id}>
                      <IconButton>
                        <ModeEditOutlineOutlinedIcon fontSize="medium" />
                      </IconButton><Divider orientation="vertical" flexItem />
                    </Link>
                    <Link to={"/app/props.items/" + row._id} key={"preview_" + row._id}>
                      <IconButton>
                        <VisibilityOutlinedIcon fontSize="medium" />
                      </IconButton>
                    </Link>
                    <Divider orientation="vertical" flexItem />
                    <IconButton onClick={(e) => props.deleteItem(row._id)} key={"delete_" + row._id}>
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
        count={props.count}
        rowsPerPage={props.perpage}
        page={props.currentPage}
        onPageChange={props.handleChangePage}
        onRowsPerPageChange={props.handleChangeRowsPerPage}
      />
    </React.Fragment>
  )
}

ListIndexItem2.propTypes = {}

export default ListIndexItem2