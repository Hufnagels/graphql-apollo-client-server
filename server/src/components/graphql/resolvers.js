import AuthResolver from './resolvers/auth.resolver.js'
import UserResolver from './resolvers/user.resolver.js'
import PostResolver from './resolvers/post.resolver.js'
import MapResolver from './resolvers/map.resolver.js'
import MindmapResolver from './resolvers/mindmap.resolver.js'
import ChatResolver from './resolvers/chat.resolver.js'
import BoardResolver from './resolvers/board.resolver.js'
import FilehandlingResolver from './resolvers/filehandling.resolver.js'
import TagsResolver from './resolvers/tag.resolver.js'

const resolvers = {
  Query: {
    ...UserResolver.Query,
    ...PostResolver.Query,
    ...MapResolver.Query,
    ...MindmapResolver.Query,
    ...ChatResolver.Query,
    ...BoardResolver.Query,
    ...FilehandlingResolver.Query,
    ...TagsResolver.Query,
  },
  Mutation: {
    ...AuthResolver.Mutation,
    ...UserResolver.Mutation,
    ...PostResolver.Mutation,
    ...MapResolver.Mutation,
    ...MindmapResolver.Mutation,
    ...ChatResolver.Mutation,
    ...BoardResolver.Mutation,
    ...FilehandlingResolver.Mutation,
  },
  Subscription: {
    ...ChatResolver.Subscription,
    ...BoardResolver.Subscription,
  }
}
//console.log('resolvers', resolvers)

export default resolvers