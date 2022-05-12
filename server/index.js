import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';

import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
dotenv.config()
// import AppError from './components/controllers/AppErrorController'
// import errorController from './components/controllers/errorController'

import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import homeRoutes from './src/app/routes/home.js'
import db from './src/components/database/connection/mongoconnect.js'
import resolvers from './src/components/graphql/resolvers.js'
import typeDefs from './src/components/graphql/typeDefs.js'
import { checkUserExist } from './src/app/controllers/auth.js'

const PORT = process.env.PORT || 4002;

const serverStart = async () => {
  // Create an Express app and HTTP server; we will attach both the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use('/', homeRoutes);
  const httpServer = createServer(app);

  // Create our WebSocket server using the HTTP server we just set up.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/subscriptions',
  });

  // Create the schema
  const schema = await makeExecutableSchema({ typeDefs, resolvers });

  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer({ schema }, wsServer);

  // Set up ApolloServer.
  const apolloServer = new ApolloServer({
    schema,
    csrfPrevention: true,
    cors: {
      origin: true
    },
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    formatError: (err) => {
      // Don't give the specific errors to the client.
      if (err.message.startsWith('Database Error: ')) {
        return new Error('Internal server error');
      }
      // Otherwise return the original error. The error can also
      // be manipulated in other ways, as long as it's returned.
      return err;
    },
    context: async ({ req, res }) => {
      // subscriptions
//console.log('context req.body.query', req.body.query)
      /**
       * query: 'mutation ($user: String!, $content: String!) {\n' +
        '  postMessage(user: $user, content: $content)\n' +
        '}'
       */

      // except Subscription
//console.log('context req.headers.authorization', req.headers.authorization)
      /**
       * context req.headers {
          host: 'localhost:4002',
          connection: 'keep-alive',
          'content-length': '390',
          'content-type': 'application/json',
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNjk3OGNkZmQzMTRjYjdmYjdlZWZhMSIsImVtYWlsIjoia2J2Y29uc3VsdGluZ0BnbWFpbC5jb20iLCJpYXQiOjE2NTE4MzI2ODksImV4cCI6MTY1MTgzNjI4OX0.h73q0lGmT2UzoBP1F74E3g-0Tqm9ERAC-7dIqeEs-5U',
       */

//console.log('context req.body.operationName', req.body.operationName)
      /**
       * context req.body.operationName GetPosts
       */

      // Try to retrieve a user with the token
      const token = req.headers.authorization || ''
      const user = null //await checkUserExist(token, false);
//console.log('context user', user)

      // Add the user to the context
      return { req, res };
    },//({ req, res }),
    subscriptions: {
      onConnect: (connectionParams) => {
        console.log('onConnect', connectionParams)
      },
      onDisconnect: (req, res) => { },
    },
  });

  //apolloServer.installSubscriptionHandlers(httpServer);

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  httpServer.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') console.log(
      `Server is now running on http://localhost:${PORT}${apolloServer.graphqlPath}`,
    );
  });
}

db.once("open", () => {
  if (process.env.NODE_ENV !== 'production') {
    console.info("Connected successfully to MongoDB");
    console.info("Starting Apollo server...");
  }

  serverStart()
});