module.exports = (app, Category, requireLogin) => {
  app.get('/add-category', requireLogin, (req, res, next) => {
    res.render('admin/add-category', {
      success: req.flash('success'),
      errors: req.flash('error')
    });
  });

  app.post('/add-category', async (req, res, next) => {
    const category = new Category();
    category.name = req.body.name;
    try {
      await category.save(); 
      req.flash('success', 'Successfully added a category');
      return res.redirect('/add-category');
    } 
    catch (err) {
      req.flash('error', 'Could not save the category category');
      return res.redirect('/add-category');
    }
  });
}