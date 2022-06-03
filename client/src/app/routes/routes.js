import React from "react";
import { Navigate, Outlet, Link, useParams } from "react-router-dom";

//Pages imports
///////ADMIN SECTION
import AdminLayout from "../../pages/backend/Layout/AdminLayout"
//MAPS
import MapsListIndex from "../../components/Maps/ListIndex";
//MINDMAPS
import MindmapsListIndex from "../../components/Mindmaps/ListIndex";
import MindmapListItem from "../../components/Mindmaps/ListItem";
//POSTS
import PostsListIndex from "../../components/Posts/ListIndex";
import PostPreview from "../../components/Posts/Preview";
import PostUpdate from "../../components/Posts/UpdateItem";
//USERS
import UsersListIndex from '../../components/Users/ListIndex2'
import UsersListItem from "../../components/Users/ListItem";
// import Profile from '../pages/backend/User/Profile'
import Chat from "../../components/Chat/Chat"
import BoardListIndex from "../../components/Whiteboard/ListIndex"
import BoardListItem from "../../components/Whiteboard/ListItem2"

///////MAIN SECTION
import MainLayout from "../../pages/frontend/Layout/MainLayout";
import Home from "../../pages/frontend/Home";
import Blog from "../../pages/frontend/Blog"
import SignInSide from "../../components/Auth/SigIn";
import SignUp from "../../components/Auth/SignUp";

const routes = (isLoggedIn) => [
  {
    path: "/app",
    element: isLoggedIn ? <AdminLayout /> : <Navigate to="/signin" />,
    children: [
      { index: true, element: <Dashboard /> },
      //{ path: '/', element: <Navigate to="/app/dashboard" /> },
      {
        path: "/app/courses",
        element: <Courses />,
        name: 'Courses',
        description: '',
        children: [
          { index: true, element: <CoursesIndex /> },
          { path: "/app/courses/:id", element: <Course /> },
        ],
      },
      {
        path: '/app/maps',
        element: <Outlet />,
        name: 'Maps',
        description: 'Leaflet maps',
        children: [
          { index: true, element: <MapsListIndex /> },
          //{ path: '/app/user/profile', element: <Profile /> },
        ],
      },
      {
        path: '/app/mindmaps',
        element: <Outlet />,
        name: 'Mindmaps',
        description: 'D3.js mindmaps',
        children: [
          { index: true, element: <MindmapsListIndex /> },
          { path: '/app/mindmaps/:id', element: <MindmapListItem /> },
        ],
      },
      {
        path: '/app/whiteboards',
        element: <Outlet />,
        name: 'Whiteoard',
        description: 'Collaborative Whiteboard via subscription',
        children: [
          { index: true, element: <BoardListIndex /> },
          { path: '/app/whiteboards/:boardid', element: <BoardListItem /> },
        ],
      },
      {
        path: "/app/blogs",
        element: <Outlet />,
        name: 'Blogs',
        description: 'Blog posts',
        children: [
          { index: true, element: <PostsListIndex /> },
          { path: "/app/blogs/:id", element: <PostUpdate /> },
          { path: "/app/blogs/:id/preview", element: <PostPreview /> },
        ],
      },
      {
        path: "/app/chat",
        element: <Chat />,
        name: 'Chat',
        description: 'Chat module',

      },
      {
        path: '/app/users',
        element: <Outlet />,
        name: 'Users',
        description: 'Users list',
        children: [
          { index: true, element: <UsersListIndex /> },
          { path: '/app/users/:id', element: <UsersListItem /> },
        ],
      },
      {
        path: "*",
        element: <NoMatch />,
        name: 'Nomatch',
        description: '404',
      },
      // https://stackoverflow.com/questions/62384395/protected-route-with-react-router-v6
      // {
      //   path: 'member',
      //   element: <Outlet />,
      //   children: [
      //     { path: '/', element: <MemberGrid /> },
      //     { path: '/add', element: <AddMember /> },
      //   ],
      // },
    ],
  },
  {
    path: '/',
    element: <MainLayout />, //!isLoggedIn ? <MainLayout /> :null,
    children: [
      {
        path: 'signin',
        element: <SignInSide />,
        name: 'SignIn',
        description: 'SignIn page',
      },
      {
        path: 'signup',
        element: <SignUp />,
        name: 'SignUp',
        description: 'SignUp page - Registration',
      },
      {
        path: 'blog',
        element: <Outlet />,
        children: [
          { index: true, element: <BlogListIndex /> },
          { path: "/blog/:id", element: <BlogListItem /> },
        ],
      },
      {
        path: '/',
        element: <Home />,
        name: 'Home',
        description: '',
      }, //<Navigate to="/login" /> },

      {
        path: "*",
        element: <NoMatch />,
        name: 'NoMatch',
        description: '404',
      },
    ],
  },
];

export default routes

function Dashboard() {
  return (
    <div>Dashboard</div>
  )
}
function BlogListIndex() {
  return (
    <div>BlogListIndex</div>
  )
}
function BlogListItem() {
  return (
    <div>BlogListItem</div>
  )
}

function Courses() {
  return (
    <div>
      <h2>Courses</h2>
      <Outlet />
    </div>
  );
}

function CoursesIndex() {
  return (
    <div>
      <p>Please choose a course:</p>

      <nav>
        <ul>
          <li>
            <Link to="react-fundamentals">React Fundamentals</Link>
          </li>
          <li>
            <Link to="advanced-react">Advanced React</Link>
          </li>
          <li>
            <Link to="react-router">React Router</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function Course() {
  let { id } = useParams('id');

  return (
    <div>
      <h2>
        Welcome to the {id.split("-").map(capitalizeString).join(" ")} course!
      </h2>

      <p>This is a great course. You're gonna love it!</p>

      <Link to="/app/courses">See all courses</Link>
    </div>
  );
}

function capitalizeString(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function NoMatch() {
  return (
    <div>
      <h2>It looks like you're lost...</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}