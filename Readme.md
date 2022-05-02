# Node.js Template with GraphQL API for MongoDB And React Boilerplate with Apollo, Redux Toolkit
Apollo server (express) with mongoose

> MongoDB 4.2 in Docker on Ubuntu
> 
> Heroku and netlify deploy --> TODO: make

# TOC
not yet

## Template description
In .env.local define the MongoDB connection params
Folder structure:
Everythings are in components folder:
- database --> MongoDB connection
- database / models --> MongoDB models
- routes --> default response for localhost:PORT
- schema --> typeDefs, resolvers with autoload
- schema / typedefs --> separated typeDefs for collections
- schema / resolvers --> separated resolvers for collections

### Querys
- get all data from collection with search parameters (search string, page number, limit)
- get one data by ID (_id)

### TODO
> Mutations for all collections
> Authentication to use API


## Add db user
***mongodb need privileged user on db and collections***

## Define SCHEMA
for users, maps --> editng history
> Note: maybe socket is coming to collaborate
