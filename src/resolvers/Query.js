const Query = {
  users(parent, args, { db }, info) {
    if (args.query) {
      const filtered = db.users.filter((u) => {
        return u.body.includes(args.query) || u.title.includes(args.query)
      })
      return filtered
    } else {
      return db.users
    }
  },
  posts(parent, args, { db }, info) {
    if (args.query) {
      const filtered = db.posts.filter((p) => {
        return p.body.includes(args.query) || p.title.includes(args.query)
      })
      return filtered
    } else {
      return db.posts
    }
  },
  comments(parent, args, { db }, info) {
    if (args.query) {
      const filteredComments = db.comments.filter((comment) => {
        return comment.text.includes(args.query)
      })
      return filteredComments
    } else {
      return db.comments
    }
  },
}

export default Query
