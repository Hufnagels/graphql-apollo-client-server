import UserResolver from './resolvers/user.resolver.js'
import PostResolver from './resolvers/post.resolver.js'
import MapResolver from './resolvers/Map.resolver.js'
import MindmapResolver from './resolvers/Mindmap.resolver.js'

const resolvers = {
  Query: {
    ...UserResolver.Query,
    ...PostResolver.Query,
    ...MapResolver.Query,
    ...MindmapResolver.Query,
  },
  Mutation: {
    ...UserResolver.Mutation,
    ...PostResolver.Mutation,
    ...MapResolver.Mutation,
    ...MindmapResolver.Mutation,
  }
}
//console.log('resolvers', resolvers)

export default resolvers