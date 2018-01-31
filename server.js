const express = require('express')
const Cors = require("cors")
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const moment = require('moment')
var db

const url = 'mongodb://'+process.env.username+':'+process.env.password+'@ds217138.mlab.com:17138/slaiju';
const dbName = 'slaiju';
MongoClient.connect(url, (err, database) => {
  if (err) return console.log(err)
  console.log("Connected successfully to server");
  db = database.db(dbName);
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.use(Cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/set', (req, res) => {
  db.collection('set').find().toArray((err, result) => {
    if (err) res.json({"success":false,"result":err})
    console.log(result)
    res.json(result)
  })
})

app.post('/set', (req, res) => {
  db.collection('set').save(req.body, (err, result) => {
    if (err) res.json({"success":false})
    console.log('saved to database')
    res.json({"success":true})
  })
})

app.delete('/set', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) res.json({"success":false})
    res.json({"success":true})
  })
})
