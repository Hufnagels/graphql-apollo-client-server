import React from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, } from "@apollo/client";

import { GET_USER } from "../../app/queries";

const ListItem = () => {
  const { id } = useParams('id');
  const navigate = useNavigate();

  const [user, setUser] = React.useState([])
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: id }
  });

  React.useEffect(() => {
    //console.log('PostsListIndex --> data useEffect')
    if (!data) return
    setUser(data.getUser)
    // console.log(data)
  }, [data])

  if (loading) return "Loading...."
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>

  return (
    <div>
      <h3>ListItem {user.username}</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={() => navigate(-1)}>go back</button>
    </div>
  )
}

export default ListItem