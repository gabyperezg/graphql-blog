let comments = [
  {
    text: 'This is comment 1 ',
    id: '11',
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

let users = [
  {
    name: 'Gaby',
    age: '30',
    id: '1',
  },
  {
    name: 'Gina',
    age: '34',
    id: '2',
  },
  {
    name: 'Sebas',
    age: '23',
    id: '3',
  },
]
let posts = [
  {
    id: '1',
    title: 'Post 1',
    body: 'Body super post 1',
    published: true,
    author: '1',
    comment: '11',
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

const db = {
  users,
  posts,
  comments,
}

export default db
