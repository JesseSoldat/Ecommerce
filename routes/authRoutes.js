const passportService = require('../services/passport');

module.exports = (app, User, passport) => {


  app.get('/signup', (req, res, next) => {
    res.render('accounts/signup', {
      errors: req.flash('errors')
    });
  });

  app.post('/signup', async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = new User();
    user.profile.name = name;
    user.email = email;
    user.password = password;
    try {
      const existingUser = await User.findOne({ email }); 
      if(existingUser) {
        req.flash('errors', 'Account with that email address already exists');
        res.redirect('/signup');
      }
      await user.save((err, user) => {
        if(err) return next(err);
        res.redirect('/profile');
      });
    } 
    catch (err) {
      console.log(err);    
    }
    
    
  });

  app.get('/login', (req, res, next) => {
    if(req.user) return res.redirect('/');
    res.render('accounts/login', {
      errors: req.flash('errors')
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/profile', (req, res, next) => {
    res.render('accounts/profile');
  });
}