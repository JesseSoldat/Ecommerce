require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const engine = require('ejs-mate');


const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.engine('ejs', engine);
app.set('view engine', 'ejs');

require('./routes/mainRoutes')(app);

app.listen(process.env.PORT, (err) => {
  if(err) throw errr;
  console.log(`Server is running at port: ${process.env.PORT}`);
});