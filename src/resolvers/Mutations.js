import uuid from 'uuid/v4'

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email)
    if (emailTaken) {
      throw new Error('Email is taken')
    }
    const user = {
      id: uuid(),
      ...args.data,
    }

    db.users.push(user)

    return user
  },
  createPost(parent, args, { db }, info) {
    const userExists = db.users.some((user) => user.id === args.post.author)
    if (!userExists) {
      throw new Error('User not found')
    }
    const post = {
      id: uuid(),
      ...args.post,
    }

    db.posts.push(post)

    return db.post
  },
  createComment(parent, args, { db }, info) {
    const userExists = db.users.some((user) => user.id === args.comment.author)
    const postExists = db.posts.some(
      (post) => post.id === args.comment.post && post.published
    )
    if (!postExists || !userExists) {
      throw new Error('Post or user not found')
    }

    const comment = {
      id: uuid(),
      ...args.comment,
    }

    db.comments.push(comment)

    return comment
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id)

    if (!userIdex) {
      throw new Error('User Not Found')
    }

    const deletedUsers = db.users.splice(userIndex, 1)

    posts = db.posts.filter((post) => {
      const match = post.author === args.id

      if (match) {
        comments = db.comments.filter((comment) => comment.post !== post.id)
      }

      comments = db.comments.filter((comment) => comment.author !== args.id)

      return !match
    })

    return deletedUsers[0]
  },
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id)

    if (postIndex === -1) {
      throw new Error('Post not Found')
    }

    const deletedPosts = db.posts.splice(postIndex, 1)

    comments = db.comments.filter((comment) => comment.author !== args.id)

    return deletedPosts[0]
  },
  deleteComment(parent, args, { db }) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    )

    if (commentIndex === -1) {
      throw new Error('Comment not found')
    }

    const deletedComments = db.comments.splice(commentIndex, 1)

    return deletedComments[0]
  },
}

export default Mutation
