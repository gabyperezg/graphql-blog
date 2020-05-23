import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
// Type definitions (schema)
// Tipos de datos - Scalar types - String, Boolean, Int, Float (numeros decimales), ID
const comments = [
  {
    text: 'This is comment 1 ',
    id: 11,
    author: 1,
    post: 1,
  },
  {
    text: 'This is comment 2 ',
    id: 12,
    author: 2,
    post: 2,
  },
  {
    text: 'This is comment 3 ',
    id: 13,
    author: 3,
    post: 3,
  },
]

const users = [
  {
    name: 'Gaby',
    age: '30',
    id: 1,
  },
  {
    name: 'Gina',
    age: '34',
    id: 2,
  },
  {
    name: 'Sebas',
    age: '23',
    id: 3,
  },
]
const posts = [
  {
    id: 1,
    title: 'Post 1',
    body: 'Body super post 1',
    published: true,
    author: 1,
    comment: 11,
  },
  {
    id: 2,
    title: 'Post 2',
    body: 'Body post 2',
    published: true,
    author: 2,
    comment: 12,
  },
  {
    id: 3,
    title: 'Post 3',
    body: 'Body post 3',
    published: false,
    author: 3,
    comment: 13,
  },
]

const typeDefs = `
    type Query {
        me: User!
        post: Post!
        add(a: Int!, b: Int!): Int!
        users(query: String): [User!]
        posts(query: String): [Post]!
        comments(query: String): [Comment]!
    }

    type Mutation{
        createUser(name: String!, email: String): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(text: String!, author: ID!, post: ID!): Comment!
    }

    type User {
      name: String!
      id: ID!
      email: String
      posts: [Post!]
      comments: [Comment!]
    }

    type Post {
      title: String!
      id: ID!
      body: String!
      published: Boolean!
      author: User!
      comments: [Comment!]
    }

    type Comment {
      text: String!
      id: ID!
      author: User!
      post: Post!
    }
`

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        name: 'Gaby',
        id: '123dce',
      }
    },
    post() {
      return {
        title: 'First Post',
        id: '123postid',
        body: 'This is a super cool post',
        published: true,
      }
    },
    add(parent, args) {
      return args.a + args.b
    },
    users(parent, args, ctx, info) {
      if (args.query) {
        const filtered = users.filter((u) => {
          return u.body.includes(args.query) || u.title.includes(args.query)
        })
        return filtered
      } else {
        return users
      }
    },
    posts(parent, args, ctx, info) {
      if (args.query) {
        const filtered = Posts.filter((p) => {
          return p.body.includes(args.query) || p.title.includes(args.query)
        })
        return filtered
      } else {
        return posts
      }
    },
    comments(parent, args, ctx, info) {
      if (args.query) {
        const filteredComments = comments.filter((comment) => {
          return comment.text.includes(args.query)
        })
        return filteredComments
      } else {
        return comments
      }
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.email)
      if (emailTaken) {
        throw new Error('Email is taken')
      }
      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
      }

      users.push(user)

      return user
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.author)
      if (!userExists) {
        throw new Error('User not found')
      }
      const post = {
        id: uuidv4(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author,
      }

      posts.push(post)

      return post
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.author)
      const postExists = posts.some(
        (post) => post.id === args.post && post.published
      )
      if (!postExists || !userExists) {
        throw new Error('Post or user not found')
      }

      const comment = {
        id: uuidv4(),
        text: args.text,
        author: args.author,
        post: args.post,
      }

      comments.push(comment)

      return comment
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return parent.id === comment.post
      })
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id
      })
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return parent.author === user.id
      })
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return parent.post === post.id
      })
    },
  },
}

// crear instancia de graphql para levantar el servidor
const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

// inicia el servidor con un callback que corre cuando el servidor ya esta corriendo
server.start('the server is running')
