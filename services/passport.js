const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

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