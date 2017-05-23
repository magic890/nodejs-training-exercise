const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

var db;

// CORS middleware
var allowCORS = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTION, PATCH');
  next();
};

MongoClient.connect('mongodb://localhost:27071/local', (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server listening on '+ (process.env.PORT || 3000));
  });
})

app.use(allowCORS);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use(express.static('public'));

app.get('/', (req, res) => {
  db.collection('todolist').find().toArray((err, result) => {
    if (err) {
      console.log(err);
      return res.send(500, err);
    }
    res.send(result);
  })
})

app.post('/', (req, res) => {
  db.collection('todolist').save(req.body, (err, result) => {
    if (err) {
      console.log(err);
      return res.send(500, err);
    }
    console.log('Todo item saved', result);
    res.send(result);
    //res.redirect('/');
  })
})

app.put('/', (req, res) => {
  db.collection('todolist')
  .findOneAndUpdate({}, {
    $set: {
      name: req.body.name,
      checked: req.body.checked
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) {
      console.log(err);
      return res.send(500, err);
    }
    console.log('Todo item updated', result);
    res.send(result);
  })
})

app.delete('/', (req, res) => {
  db.collection('todolist')
  .findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) {
      console.log(err);
      return res.send(500, err);
    }
    console.log('Todo item deleted', result);
    res.send(result);
  })
})
