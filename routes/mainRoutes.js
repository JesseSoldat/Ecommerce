module.exports = (app, Category, Product) => {
  app.get('/', (req, res, next) => {
    res.render('main/home');
  });

  app.get('/products/:id', (req, res, next) => {
    const {id} = req.params;
 
    Product
      .find({category: id})
      .populate('category')
      .exec((err, products) => {
        if(err) return next(err);
        res.render('main/category', {
          products
        })
      });
 
  });
}