import AuthResolver from './resolvers/auth.resolver.js'
import UserResolver from './resolvers/user.resolver.js'
import PostResolver from './resolvers/post.resolver.js'
import MapResolver from './resolvers/Map.resolver.js'
import MindmapResolver from './resolvers/Mindmap.resolver.js'
import ChatResolver from './resolvers/Chat.resolver.js'

const resolvers = {
  Query: {
    ...UserResolver.Query,
    ...PostResolver.Query,
    ...MapResolver.Query,
    ...MindmapResolver.Query,
    ...ChatResolver.Query,
  },
  Mutation: {
    ...AuthResolver.Mutation,
    ...UserResolver.Mutation,
    ...PostResolver.Mutation,
    ...MapResolver.Mutation,
    ...MindmapResolver.Mutation,
    ...ChatResolver.Mutation,
  },
  Subscription: {
    ...ChatResolver.Subscription,
  }
}
//console.log('resolvers', resolvers)

export default resolvers