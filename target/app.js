const express = require('express')
const path = require('path')
const { Client } = require('pg')
require('dotenv').config()

const app = express()
const port = 3000

console.log('PGCON', process.env.PGCONNECTION)
const client = new Client({ connectionString: process.env.PGCONNECTION })
client.connect()

const posts = [
  {
    id: 1,
    title: 'This is great',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
  },
  {
    id: 2,
    title: 'This is perfect',
    description:
      'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
  },
]

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/posts', (req, res) => {
  client
    .query('SELECT * FROM post')
    .then((queryRes) => res.json(queryRes.rows))
    .catch((e) => console.error(e.stack))
})

app.listen(port, () => {
  console.log(`Target running on port ${port}`)
})
