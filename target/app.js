const express = require('express')
const path = require('path')
const app = express()
const port = 3000

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
  res.json(posts)
})

app.listen(port, () => {
  console.log(`Target running on http://localhost:${port}`)
})
