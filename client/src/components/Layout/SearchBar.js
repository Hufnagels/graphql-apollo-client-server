import React, { memo } from 'react'
import PropTypes from 'prop-types';

// Material
import {
  Box,
  Paper,
  AppBar,
  Toolbar,
  InputBase,
  Typography,
  Button,
  IconButton,
  Pagination,
  Stack,
  Divider,
  useScrollTrigger,
  FormControl,
  Select,
  MenuItem
} from '@mui/material'

import { useTheme, styled, alpha } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// Custom
import PaginationComponent from './Pagination';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
    color: theme.palette.custom.light
  },
  margin: theme.spacing(1, 1, 1, 0),
  width: '90%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1.5),
    width: 'auto',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  '.MuiInputBase-root': {
    width: '100%'
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1),
    // vertical padding + font size from searchIcon
    //paddingLeft: `calc( ${theme.spacing(2)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    color: theme.palette.custom.dark,
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const ElevationScroll = (props) => {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,

}));

const CustomizedSearch = (props) => {
  //  console.log('CustomizedSearch', props)

  const [searchString, setSearchString] = React.useState(props.search)

  const searchFieldUpdate = (e) => {
    e.preventDefault()
    setSearchString(e.target.value)
  }

  const sendSearchData = (e) => {
    e.preventDefault()
    //props.setData([])
    props.setSearch(searchString)
  }
  const clearSearch = e => {
    e.preventDefault()
    setSearchString(null)
    props.setSearch(null)

  }
  const checkKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendSearchData(e)
    }
  }
  return (
    <Search>
      <Box sx={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }} >
        <StyledInputBase
          style={{ color: grey[800] }}
          placeholder="Search"
          inputProps={{ 'aria-label': 'search' }}
          onChange={(e) => searchFieldUpdate(e)}
          onKeyPress={(e) => { checkKeyPress(e) }}
          value={searchString === null ? '' : searchString}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={sendSearchData}>
          <SearchIcon 
            fontSize="large"
            sx={{
              color: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.custom.dark
                  : theme.palette.custom.dark,
            }}
          />
        </IconButton>
        {searchString && 
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={clearSearch} >
          <DeleteOutlineOutlinedIcon fontSize="large"
            sx={{
              color: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.custom3.light
                  : theme.palette.custom.dark,
            }}
          />
        </IconButton>
        }
      </Box>
    </Search>
  )
}

const SearchBar = (props) => {
  //console.log('SearchBar props', props)

  const theme = useTheme();

  // const handlePageChange = (event, value) => {
  //   props.setPage(value);
  //   //props.refetch()
  // };
  // const handlePerPageChange = (event, value) => {
  //   props.setPerpage(event.target.value);
  //   //props.setPage(1)
  // };
  const [displayPagination, setDisplayPagination] = React.useState(props.customPagination || false)
  // Pagination settings
  //const [currentPage, setCurrentPage] = React.useState(props.currentPage);
  const [PageSize, setPageSize] = React.useState(props.displayItemPerPage)
  // const currentTableData = React.useMemo(() => {
  //   const firstPageIndex = (currentPage - 1) * PageSize;
  //   const lastPageIndex = firstPageIndex + PageSize;
  //   return props.data.slice(firstPageIndex, lastPageIndex);
  // }, [currentPage]);

  return (
    <Box sx={{ flexGrow: 1 }} style={{ paddingBottom: '0.5rem' }}>

      {/* <ElevationScroll {...props}> */}
      <AppBar position="static" style={{ backgroundColor: theme.palette.custom.light, boxShadow: 'none' }}>
        <Toolbar disableGutters variant="dense" sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start', md: '' },
        }}
        >
          <Box sx={{ m: 1.5 }}>
            <Button
              variant="contained"
              color="custom3"
              endIcon={<AddIcon />}
              onClick={(e) => { props.setOpenDialog(true) }}
            >Add</Button>
          </Box>

          <Box sx={{ m: { sx: 1, sm: 1, md: 2 }, flexGrow: 1, display: { xs: 'none', sm: 'block' } }} >
            <Typography
              variant="h6"
              noWrap
              component="div"
              color="custom.dark"
              sx={{ flexGrow: 1, }}
            >
              {props.title}
            </Typography>
          </Box>

          {!displayPagination &&
            <Stack
              spacing={2}
              direction="row"
              sx={{
                backgroundColor: theme.palette.custom.light,
                alignItems: 'center',
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                marginTop: 1
              }}
              divider={<Divider orientation="vertical" flexItem />}
            >
              {props.recordCount && (PageSize < props.recordCount) ?
                <Item>
                  {/* <Pagination
                    count={(props.totalpage > 10) ? 10 : props.totalpage}
                    page={props.page}
                    onChange={handlePageChange}
                  /> */}

                  <PaginationComponent
                    currentPage={props.currentPage}
                    totalCount={props.recordCount}
                    pageSize={PageSize}
                    onPageChange={(page) => {
                      //setCurrentPage(page)
                      props.handlePaginationChange(page)
                    }}
                  />

                </Item>
                : null
              }
              {<Item sx={{ paddingTop: 0.1, paddingBottom: 0.1 }}>
                <FormControl sx={{ m: 1, minWidth: 80, color: theme.palette.custom.light }} variant="standard">
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={props.displayItemPerPage}
                    onChange={props.handleLimitChange}
                    autoWidth
                    label="perpage"
                    size="small"
                  >
                    {[2, 10, 20, 50, 100].map((v, idx) => <MenuItem key={idx} value={v} color="custom.light">{v}</MenuItem>)}
                  </Select>
                </FormControl>
              </Item>}
            </Stack>
          }

          <CustomizedSearch
            //fn={props.fn}
            search={props.search}
            setSearch={props.setSearch}
            page={props.page}
            perpage={props.perpage}
            setData={props.setData}
          />
        </Toolbar>
      </AppBar>
      {/* </ElevationScroll> */}
      {props.addComponent}
    </Box>
  )
}

export default SearchBar