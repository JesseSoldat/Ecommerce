const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const Cart = require('../models/cart');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  proxy: true
}, async (accessToken, refreshToken, profile, done) => {
  console.log('GOOGLE PROFILE', profile);
  
  try {
    const existingUser = await User.findOne({googleId: profile.id});
    if(existingUser) return done(null, existingUser);

    const user = await new User();
    user.googleId = profile.id;
    user.profile.name = profile.displayName;
    user.email = profile.emails[0].value || '';
    user.profile.picture = profile.photos[0].value;
    user.tokens.push({kind: 'google', accessToken});
    await user.save();
    console.log('user', user);

    const cart = new Cart();
    cart.owner = user._id;
    await cart.save();

    return done(null, user);
  } 
  catch (err) {
    done(err);
  }
  
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  profileFields: ['emails', 'displayName'],
  callbackURL: '/auth/facebook/callback',
  proxy: true
},  async (token, refreshToken, profile, done) => {
  console.log('FACEBOOK PROFILE', profile);  
  try {
   const user = await User.findOne({facebook: profile.id});
   if(user) return done(null, user);

   const newUser = new User();
   newUser.email = profile._json.email;
   newUser.profile.name = profile.displayName;
   newUser.facebookId = profile.id;
   newUser.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
   newUser.tokens.push({kind: 'facebook', token});
   await newUser.save();
   console.log('newUser', newUser);
   const cart = new Cart();
   cart.owner = newUser._id;
   await cart.save();

   return done(null, newUser);   
  } 
  catch (err) {
    return done(err);
  }
}));

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const user = await User.findOne({email});
    if(!user) {  
      return done(null, false, req.flash('errors', 'No user has been found.'));
    }
    if(!user.comparePasswords(password)) { 
      return done(null, false, req.flash('errors', 'You entered an incorrect password.'));
    }
    return done(null, user);
  } 
  catch (err) {
    return done(null, false, req.flash('error', 'An error occured while login in. Try again please.'));
  }
}));