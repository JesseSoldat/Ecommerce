const passportService = require('../services/passport');

module.exports = (app, User, passport, Cart, requireLogin) => {

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
    user.profile.picture = user.gravatar();

    try {
      const existingUser = await User.findOne({ email }); 
      if(existingUser) {
        req.flash('errors', 'Account with that email address already exists');
        res.redirect('/signup');
      }
      await user.save();
      const cart = new Cart();
      cart.owner = user._id;
      await cart.save();
      req.logIn(user, (err, done) => {
        res.redirect('/profile');  
      });
    } 
    catch (err) {
      req.flash('errors', 'An error occured while trying to create your user');
      res.redirect('/signup');
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

  app.get('/logout', (req, res, next) => {
    req.logout(() => {
      console.log('Did LOGOUT');  
    });
    req.session.destroy(function (err) {
      if (err) { return next(err); }
      console.log('authenticated', req.isAuthenticated()); 
    });
    res.redirect('/');
    
  });

  app.get('/profile', requireLogin, (req, res, next) => {
    res.render('accounts/profile');
  });

  app.get('/edit-profile', (req, res, next) => {
    res.render('accounts/edit-profile', {
      success: req.flash('success')
    });
  });

  app.post('/edit-profile',  async (req, res, next) => {
    const {_id} = req.user;
    const { name, address} = req.body;
    try {
      const user = await User.findOne({_id});
      if(name) user.profile.name = name;
      if(address) user.address = address;    
      await user.save();
      req.flash('success', 'You have successfully edited your profile');
      return res.redirect('/edit-profile');
    } 
    catch (err) {
      if (err) return next(err);
    }
  });
}