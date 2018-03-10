module.exports = (app, Category, Product) => {

  Product.createMapping(function(err, mapping) {
    if (err) {
      console.log("error creating mapping");
      console.log(err);
    } else {
      console.log("Mapping created");
      console.log(mapping);
    }
  });


  app.get('/', (req, res, next) => {
    res.render('main/home');
  });

  app.get('/products/:id', (req, res, next) => {
    const {id} = req.params;
 
    Product
      .find({category: id})
      //if data type is an object _id
      //can get all the data in category as well
      //.category.name
      .populate('category')
      .exec((err, products) => {
        if(err) return next(err);
        res.render('main/category', {
          products
        })
      });
  });

  app.get('/product/:id', async (req, res, next) => {
    try {
      const product = await Product.findById({_id: req.params.id});
      res.render('main/product', {product});
    } 
    catch(err) {
      return next(err);
    }
  });
}