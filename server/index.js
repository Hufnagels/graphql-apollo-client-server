import express from "express"
import cors from "cors"
import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
dotenv.config()
// import AppError from './components/controllers/AppErrorController'
// import errorController from './components/controllers/errorController'

import homeRoutes from './src/app/routes/home.js'

import db from './src/components/database/connection/mongoconnect.js'
import resolvers from './src/components/graphql/resolvers.js'
import typeDefs from './src/components/graphql/typeDefs.js'

const port = process.env.PORT || 4002;

const serverStart = async () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  /*
  app.use(errorController)
   */
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    //playground: true,
    formatError: (err) => {
      // Don't give the specific errors to the client.
      if (err.message.startsWith('Database Error: ')) {
        return new Error('Internal server error');
      }
      // Otherwise return the original error. The error can also
      // be manipulated in other ways, as long as it's returned.
      return err;
    },
    context: ({ req, res }) => ({ req, res }),
  })

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(port, () => {
    console.info(`Expressserver listening at ${port}`)
    console.info(`Apolloserver ready at http://localhost:${port}${apolloServer.graphqlPath}`)
  })
  app.use('/', homeRoutes);
}

db.once("open", () => {
  console.info("Connected successfully to MongoDB");
  console.info("Starting Apollo server...");
  serverStart()
});