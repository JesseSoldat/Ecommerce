require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const engine = require('ejs-mate');

const User = require('./models/user');

const app = express();

mongoose.connect(process.env.MONGO_URI, (err) => {
  if(err) return console.log(err);
  console.log('Connected to the database');
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.engine('ejs', engine);
app.set('view engine', 'ejs');

require('./routes/authRoutes')(app, User);
require('./routes/mainRoutes')(app);

app.listen(process.env.PORT, (err) => {
  if(err) throw errr;
  console.log(`Server is running at port: ${process.env.PORT}`);
});