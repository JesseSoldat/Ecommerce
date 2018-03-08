
module.exports = (app, User) => {


  app.get('/signup', (req, res, next) => {
    res.render('accounts/signup');
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
        res.redirect('/signup');
      }
      await user.save((err, user) => {
        if(err) return next(err);
        res.redirect('/');
      });
    } 
    catch (err) {
      console.log(err);    
    }
    
    
  });
}