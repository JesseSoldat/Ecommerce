require('./config/config');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const engine = require('ejs-mate');
var stripe = require('stripe') (process.env.STRIPE_SECRET_KEY);


const User = require('./models/user');
const Category = require('./models/category');
const Product = require('./models/product');
const Cart = require('./models/cart');
const cartAmount = require('./middleware/cart-amount');
const requireLogin = require('./middleware/require-login');

const app = express();

mongoose.connect(process.env.MONGO_URI, (err) => {
  if(err) return console.log(err);
  console.log('Connected to the database');
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGO_URI,
    autoReconnect: true
  })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session({
  resave: false,
  secret: process.env.SESSION_SECRET, 
  saveUninitialized: false, 
  cookie: { maxAge: 1000 }
}));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(cartAmount);
app.use(async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.locals.categories = categories;
    next(); 
  } 
  catch (err) {
    next();
  }
});
app.engine('ejs', engine);
app.set('view engine', 'ejs');


require('./routes/authRoutes')(app, User, passport, Cart, requireLogin);
require('./routes/mainRoutes')(app, User, Category, Product, Cart, stripe, requireLogin);
require('./routes/adminRoutes')(app, Category, Product, requireLogin);
require('./api/api')(app, Category, Product);

app.listen(process.env.PORT, (err) => {
  if(err) throw errr;
  console.log(`Server is running at port: ${process.env.PORT}`);
});