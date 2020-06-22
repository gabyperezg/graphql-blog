import uuid from 'uuid/v4'

const Mutation = {
  //----------------- USER MUTATIONS ---------------//
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
  updateUser(parent, args, { db }, info) {
    const { id, data } = args
    const user = db.users.find((user) => user.id === id)
      
    if (!user) {
      throw new Error('user not found')
    }
    if (typeof data.email === 'string') {
      const emailTaken = db.users.some((user) => data.email)

      if (!emailTaken) {
        throw new Error('Email taken')
      }
      user.email = data.email
    }
    if (typeof data.name === 'string') {
      user.name = data.name
    }
    console.log(user)
    return user
  },

  //----------------- POST MUTATIONS ---------------//
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.post.author)

    if (!userExists) {
      throw new Error('User not found')
    }
    const post = {
      id: uuid(),
      ...args.post,
    }

    db.posts.push(post)

    if (args.post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post,
        },
      })
    }

    return post
  },

  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id)

    if (postIndex === -1) {
      throw new Error('Post not Found')
    }

    const [post] = db.posts.splice(postIndex, 1)

    db.comments = db.comments.filter((comment) => comment.author !== args.id)

    if(post.publised){
      pubsub.publish(`post`,{
        post:{
          mutation: 'DELETED',
          data: post
        }
      } )
    }

    return post
  },
  updatePost(parent, args, { db,pubsub }, info) {
    const { id, data } = args
    const post = db.posts.find((post) => post.id === id)

    const originalPost = {...post}
    if (!post) {
      throw new Error('Post not found')
    }
    if (typeof data.title === 'string') {
      post.title = data.title
    }
    if (typeof data.body === 'string') {
      post.body = data.body
    }
    if (typeof data.published === 'boolean') {
      post.published = data.published

      if(originalPost.published && !post.published){
        //deleted
        pubsub.publish('post',{
          post:{
            mutation: 'DELETED',
            data: originalPost
          }
        })
      }else if (!originalPost.published && post.published){
        //created
        pubsub.publish('post',{
          post:{
            mutation: 'CREATED',
            data: post
          }
        })
      }

      //somechange
    }else if (post.published){
      //updated
      pubsub.publish('post',{
        post:{
          mutation: 'UPDATED',
          data: post
        }
      })
    }

    return post
  },
  //----------------- COMMENT MUTATIONS ---------------//
  createComment(parent, args, { db, pubsub }, info) {
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

    pubsub.publish(`comment ${args.comment.post}`, { comment })

    return comment
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
  updateComment(parent, args, { db }, ctx) {
    const { id, data } = args
    const comment = db.comments.find((comment) => comment.id === id)

    if (!comment) {
      throw new Error(' Comment not found')
    }

    if (typeof data.text === 'string') {
      comment.text = data.text
    }

    return comment
  },
}

export default Mutation
