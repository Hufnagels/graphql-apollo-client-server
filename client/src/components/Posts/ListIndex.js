import React, { memo } from 'react'
import { useLazyQuery, } from '@apollo/client';
import { useLocation } from 'react-router-dom'
import _ from 'lodash'

// Material
import {
  Box,
  Grid,
  CircularProgress,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';

// Custom
import ListIndexItem from './ListIndexItem';
import { GET_POSTS } from "../../app/queries";
import PostAdd from './Add';
import SearchBar from '../Layout/SearchBar';
import { makeListTitleFromPath } from '../../app/functions/text'

const ListIndex = () => {
  // console.log('ListIndex'
  const location = useLocation();
  const [title, setTitle] = React.useState(makeListTitleFromPath(location.pathname) + ' list')

  const theme = useTheme();

  const [openDialog, setOpenDialog] = React.useState(false)
  const [search, setSearch] = React.useState(null)

  const [posts, setPosts] = React.useState({ data: [] })

  const [page, setPage] = React.useState(1);
  const [totalpage, setTotalPage] = React.useState(1)
  const [perpage, setPerpage] = React.useState(10)
  const [count, setCount] = React.useState(0)
  const [visiblePN, setVisiblePN] = React.useState(false)

  const [
    fetchFilteredPosts,
    { data, loading, error, refetch }
  ] = useLazyQuery(GET_POSTS, {
    variables: {
      search,
      page: page,
      limit: perpage
    },
    onCompleted: ({ getPosts }) => {
      // console.log('getPosts', getPosts)
      //setPosts(getPosts.posts)
      setTotalPage(getPosts.totalPages)
      setPage(getPosts.currentPage)
      setPosts({
        ...posts,
        data: getPosts.posts
      })
      setTotalPage(getPosts.totalPages)
      setCount(getPosts.count)
      if (getPosts.posts.length > 0)
        setVisiblePN(true)
      else
        setVisiblePN(false)
    },
    onError: (error) => {
      // console.log(error)
    }
  })

  React.useEffect(() => {
    fetchFilteredPosts()
  }, [])

  // React.useEffect(() => {
  //   if (!data) return
  //   setPosts(data.getPosts.posts)
  //   setTotalPage(data.getPosts.totalPages)
  //   if (data.getPosts.posts.length > 0)
  //     setVisiblePN(true)
  //   else
  //     setVisiblePN(false)
  // }, [data])

  // React.useEffect(() => {
  //   // console.log('ListIndex --> search useEffect', page, perpage, totalpage, data)
  //   if (!page) return
  //   fetchFilteredPosts({
  //     variables: {
  //       search,
  //       page: page,
  //       limit: perpage
  //     }
  //   }).then((res) => {
  //     // console.log('res', res)
  //     setPosts(res.data.getPosts.posts)
  //     setTotalPage(res.data.getPosts.totalPages)
  //     setPage(res.data.getPosts.currentPage)
  //   })
  //   if (!search) return
  // }, [search, page, perpage, totalpage])

  if (loading) return <React.Fragment><CircularProgress color="secondary" />Loading....</React.Fragment>

  return (
    <React.Fragment>
      <Box style={{ padding: '0rem' }}>
        <SearchBar
          title={title}
          fn={fetchFilteredPosts}
          search={search}
          setSearch={setSearch}
          page={page}
          setPage={setPage}
          perpage={perpage}
          setPerpage={setPerpage}
          totalpage={totalpage}
          setData={setPosts}
          visiblePN={visiblePN}
          refetch={refetch}
          active={openDialog}
          setOpenDialog={setOpenDialog}
          addComponent={
            <PostAdd onClick={setOpenDialog} active={openDialog} refetch={refetch} />
          }
        />
        <Grid container spacing={{ sm: 1, md: 1 }} >
          {posts.data && posts.data.map((post, idx) => {
            return <ListIndexItem data={post} key={idx} />
          })}
        </Grid>
      </Box>
    </React.Fragment>
  )
}

export default memo(ListIndex)