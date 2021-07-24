const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

app.get('/', function (req, res) {
  console.log(req.query)
  res.end()
})

app.listen(3001)
