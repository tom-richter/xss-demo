const express = require('express')
const path = require('path')
const { Client } = require('pg')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()
const port = 3000

const client = new Client({ connectionString: process.env.PGCONNECTION })
client.connect()

app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(express.json())

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/posts', (req, res) => {
  client
    .query('SELECT * FROM post')
    .then((queryRes) => res.json(queryRes.rows))
    .catch((e) => console.error(e.stack))
})

app.get('/api/profile', authenticateToken, (req, res) => {
  res.json(req.user)
})

app.post('/api/posts', authenticateToken, (req, res) => {
  const post = req.body
  client
    .query(
      `INSERT INTO post(user_name, title, description) VALUES ('${
        req.user.name
      }', '${post.title.replace(/'/g, "''")}', '${post.description.replace(
        /'/g,
        "''"
      )}')`
    )
    .then((queryRes) => res.status(201).end())
    .catch((e) => console.error(e.stack))
})

app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  const queryRes = await client.query(
    `SELECT * FROM post WHERE id=${req.params.id}`
  )
  if (queryRes.rows.length) {
    if (queryRes.rows[0].user_name === req.user.name) {
      await client.query(`DELETE FROM post WHERE id=${req.params.id}`)
    }
  }
  res.status(200).end()
})

app.post('/api/login', async (req, res) => {
  const queryRes = await client.query(
    `SELECT * FROM users WHERE name='${req.body.username}' AND password='${req.body.password}'`
  )
  if (!queryRes.rows.length) {
    res.status(400).end()
  } else {
    const user = { name: queryRes.rows[0].name }
    const accessToken = generateAccessToken(user)
    res.json({ accessToken: accessToken })
  }
})

app.post('/api/register', async (req, res) => {
  const user = req.body
  client
    .query(
      `INSERT INTO users(name, password) VALUES ('${user.username.replace(
        /'/g,
        "''"
      )}', '${user.password.replace(/'/g, "''")}')`
    )
    .then((queryRes) => res.status(201).end())
    .catch((e) => console.error(e.stack))
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '36000s',
  })
}

app.listen(port, () => {
  console.log(`Target running on port ${port}`)
})
