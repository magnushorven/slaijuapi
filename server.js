const express = require('express')
const Cors = require("cors")
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID;
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
  db.collection('set').findOneAndDelete({_id: ObjectId(req.body.id)}, (err, result) => {
    if (err) res.json({"success":false})
    res.json({"success":true})
  })
})

app.get('/goal', (req, res) => {
  db.collection('goal').find().toArray((err, result) => {
    if (err) res.json({"success":false,"result":err})
    console.log(result)
    res.json(result)
  })
})
app.put('/goal', (req, res) => {
  db.collection('goal')
  .findOneAndUpdate({name: 'weeklyGoal'}, {
    $set: {
      weeklyGoal: req.body.weeklyGoal
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.json({"success":false,"result":err})
    res.json(result)
  })
})
