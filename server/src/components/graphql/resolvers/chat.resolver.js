import _ from 'lodash'
import { ApolloError, } from 'apollo-server-express'
import { PubSub } from 'graphql-subscriptions';
import { issueTokens, checkSignedIn, getRefreshToken } from '../../../app/controllers/auth.js'

const pubsub = new PubSub();
const messages = [];
const subscribers = [];
const onMessagesAdded = (fn) => subscribers.push(fn);

const ChatResolver = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    // Protected routes
    postMessage: async (parent, { user, content }, { req }) => {
      console.log('Chat postMessage req.headers', req.headers)
      await checkSignedIn(req, true)
      const id = messages.length;
      messages.push({
        id,
        user,
        content,
      });
      subscribers.forEach((fn) => fn());
      return id;
    },
  },
  Subscription: {
    messages: {
      subscribe: (parent, { req }, context) => {
        console.log('Subscription subscribe', parent, { req }, context)
        const channel = Math.random().toString(36).slice(2, 15);
        onMessagesAdded(() => pubsub.publish(channel, { messages }));
        setTimeout(() => pubsub.publish(channel, { messages }), 0);
        return pubsub.asyncIterator(channel);
      },
    },
  },
}

export default ChatResolver