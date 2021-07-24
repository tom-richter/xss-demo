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

app.get('/api/users', authenticateToken, (req, res) => {
  client
    .query('SELECT * FROM users')
    .then((queryRes) => res.json(queryRes.rows))
    .catch((e) => console.error(e.stack))
})

app.post('/api/posts', authenticateToken, (req, res) => {
  const post = req.body
  client
    .query(
      `INSERT INTO post(user_name, title, description) VALUES ('${
        req.user.name
      }', '${post.title.replaceAll("'", "''")}', '${post.description.replaceAll("'", "''")}')`
    )
    .then((queryRes) => res.status(201).end())
    .catch((e) => console.error(e.stack))
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

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '36000s',
  })
}

app.listen(port, () => {
  console.log(`Target running on port ${port}`)
})
