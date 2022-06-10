import React, { memo } from 'react'
import { useLazyQuery, useQuery, useMutation} from '@apollo/client';
import { useLocation } from 'react-router-dom'
import _ from 'lodash'

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

  const { data, loading, error, refetch } = useQuery(
    //const [ fetchFilteredPosts, { data, loading, error, refetch } ] = useLazyQuery(
    GET_POSTS,
    {
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
    //fetchFilteredPosts()
    return () => {
      setPosts({data: []})
    }
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
            <Add onClick={setOpenDialog} active={openDialog} refetch={refetch} data={posts} setData={setPosts}/>
          }
        />
        <Grid container spacing={{ sm: 1, md: 1 }} >
        {error && <Alert severity="warning">{JSON.stringify(error, null, 2)}</Alert>}
          {posts.data && posts.data.map((post, idx) => {
            return <ListIndexItem data={post} key={post._id} delete={deleteItem} />
          })}
        </Grid>
      </Box>
    </React.Fragment>
  )
}

export default memo(ListIndex)