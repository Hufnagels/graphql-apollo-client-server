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

// Custom
import { PORT, ORIGIN } from './src/app/config/config.js'
import homeRoutes from './src/app/routes/home.js'
import db from './src/components/database/connection/mongoconnect.js'
import resolvers from './src/components/graphql/resolvers.js'
import typeDefs from './src/components/graphql/typeDefs.js'
import { checkUserExist } from './src/app/controllers/auth.js'

const serverPort = PORT //process.env.PORT || 4002;
const origin = ORIGIN
const corsOptions = {
  origin,
  credentials: true // <-- REQUIRED backend setting
};

const serverStart = async () => {
  // Create an Express app and HTTP server; we will attach both the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express();
  //app.use(cors(corsOptions));
  app.use(cors())

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

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
      origin: ["http://localhost:3000", "http://192.168.1.125:3000"],
      credentials: true
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
      // Try to retrieve a user with the token
      const token = req.headers.authorization || ''
      const user = null //await checkUserExist(token, false);
      //console.log('context user', user)
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
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

  httpServer.listen(serverPort, () => {
    if (process.env.NODE_ENV !== 'production') console.log(
      `Server is now running on http://localhost:${serverPort}${apolloServer.graphqlPath}`,
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