import express from "express";
const router = express.Router();

// Default page
const WEBSITE_NAME = process.env.REACT_APP_WEBSITE_NAME || 'MONGODB';
const homeRoute = router.get('/', (req, res) => {
  res.send(`
  <h1>${WEBSITE_NAME}'s server is up and running</h1>
  <a href="/graphql" >Go to GraphQL Server</a>
  ` )
})

export default homeRoute