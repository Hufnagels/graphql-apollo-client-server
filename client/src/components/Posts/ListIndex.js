import React, { memo } from 'react'
import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import { useLocation } from 'react-router-dom'
import _ from 'lodash'
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
import { GET_POSTS, DELETE_POST } from "../../app/queries";
import Add from './Add';
import SearchBar from '../Layout/SearchBar';
import { makeListTitleFromPath } from '../../app/functions/text'

const ListIndex = () => {
  const { isLoggedIn, user, tokens } = useSelector((state) => state.auth);
  const location = useLocation();
  const [title, setTitle] = React.useState(makeListTitleFromPath(location.pathname) + ' list')

  const theme = useTheme();

  const [openDialog, setOpenDialog] = React.useState(false)
  const [search, setSearch] = React.useState(null)

  const [posts, setPosts] = React.useState([])

  const [page, setPage] = React.useState(1);
  const [totalpage, setTotalPage] = React.useState(1)
  const [perpage, setPerpage] = React.useState(10)
  const [count, setCount] = React.useState(0)
  const [visiblePN, setVisiblePN] = React.useState(false)

  const { data, loading, error, refetch } = useQuery( GET_POSTS,
    {
      variables: {
        search,
        page: page,
        limit: perpage
      },
      onCompleted: ({ getPosts }) => {
        console.log('useQuery(GET_POSTS) onCompleted:', getPosts)
        const newData = getPosts.posts
        setPosts(newData)
        setTotalPage(getPosts.totalPages)
        setCount(getPosts.count)
        if (getPosts.posts.length > 0)
          setVisiblePN(true)
        else
          setVisiblePN(false)
      },
      onError: (error) => {
        const variant = 'error'
        //enqueueSnackbar(error.message, { variant })
      }
    }
  )
  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: () => {
      console.log('deletePost')
      //fetchFilteredPosts()
      refetchQuery()
    },
    onError: (error) => {
      console.log(error)
    }
  })
  const deleteItem = (idx) => {
    console.log(idx)
    deletePost({
      variables: {
        id: idx
      }
    })
  }
  const refetchQuery = () => {
    refetch()
  }
  React.useEffect(() => {
    if (!data) return
    setPosts(data.getPosts?.posts)
    // return () => {
    //   setPosts([])
    // }
  }, [data])

  if (loading) return <React.Fragment><CircularProgress color="secondary" />Loading....</React.Fragment>

  return (
    <React.Fragment>
      <Box style={{ padding: '0rem' }}>
        <SearchBar
          title={title}
          //fn={fetchFilteredPosts}
          search={search}
          setSearch={setSearch}
          page={page}
          setPage={setPage}
          perpage={perpage}
          setPerpage={setPerpage}
          totalpage={totalpage}
          data={posts}
          setData={setPosts}
          visiblePN={visiblePN}
          refetch={refetchQuery}
          active={openDialog}
          setOpenDialog={setOpenDialog}
          addComponent={
            <Add onClick={setOpenDialog} active={openDialog} refetch={refetch} data={posts} setData={setPosts} owner={user.lastName} />
          }
        />
        <Grid container spacing={{ sm: 1, md: 1 }} >
          {error && <Alert severity="warning">{JSON.stringify(error, null, 2)}</Alert>}
          {posts && posts.map((post, idx) => {
            return <ListIndexItem data={post} key={post._id} delete={deleteItem} />
          })}
        </Grid>
      </Box>
    </React.Fragment>
  )
}

export default memo(ListIndex)