import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutations'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'
// Type definitions (schema)
// Tipos de datos - Scalar types - String, Boolean, Int, Float (numeros decimales), ID

const pubsub = new PubSub()
// Resolvers
const resolvers = {
  Query,
  Mutation,
  User,
  Post,
  Subscription,
  Comment,
}

// crear instancia de graphql para levantar el servidor
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db,
    pubsub,
  },
})

// inicia el servidor con un callback que corre cuando el servidor ya esta corriendo
server.start(console.log('The server is running in port 4000'))
