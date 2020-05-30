import { GraphQLServer } from 'graphql-yoga'
import uuid from 'uuid/v4'
import db from './db'
// Type definitions (schema)
// Tipos de datos - Scalar types - String, Boolean, Int, Float (numeros decimales), ID

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
      const emailTaken = users.some((user) => user.email === args.data.email)
      if (emailTaken) {
        throw new Error('Email is taken')
      }
      const user = {
        id: uuid(),
        ...args.data,
      }

      users.push(user)

      return user
    },
    createPost(parent, args, ctx, info) {
      console.log('author', args.post.author)
      console.log(users)

      const userExists = users.some((user) => user.id === args.post.author)
      if (!userExists) {
        throw new Error('User not found')
      }
      const post = {
        id: uuid(),
        ...args.post,
      }

      posts.push(post)

      return post
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.comment.author)
      const postExists = posts.some(
        (post) => post.id === args.comment.post && post.published
      )
      if (!postExists || !userExists) {
        throw new Error('Post or user not found')
      }

      const comment = {
        id: uuid(),
        ...args.comment,
      }

      comments.push(comment)

      return comment
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id)

      if (!userIdex) {
        throw new Error('User Not Found')
      }

      const deletedUsers = users.splice(userIndex, 1)

      posts = posts.filter((post) => {
        const match = post.author === args.id

        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id)
        }

        comments = comments.filter((comment) => comment.author !== args.id)

        return !match
      })

      return deletedUsers[0]
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id)

      if (postIndex === -1) {
        throw new Error('Post not Found')
      }

      const deletedPosts = posts.splice(postIndex, 1)

      comments = comments.filter((comment) => comment.author !== args.id)

      return deletedPosts[0]
    },
    deleteComment(parent, args, ctx) {
      const commentIndex = comments.findIndex(
        (comment) => comment.id === args.id
      )

      if (commentIndex === -1) {
        throw new Error('Comment not found')
      }

      const deletedComments = comments.splice(commentIndex, 1)

      return deletedComments[0]
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
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db,
  },
})

// inicia el servidor con un callback que corre cuando el servidor ya esta corriendo
server.start(console.log('The server is running in port 4000'))
