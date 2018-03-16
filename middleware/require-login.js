module.exports = (req, res, next) => {
  if(!req.user) {
    req.flash('errors', 'You must login to have access to this feature!');
    return res.redirect('/login');
  }
  next();
}