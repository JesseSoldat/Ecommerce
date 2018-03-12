const faker = require('faker');

module.exports = (app, Category, Product) => {
  //POSTMAN to generate fake data
  app.get('/api/:name', async (req, res, next) => {
    const {name} = req.params;
    try {
      const category = await Category.findOne({name});

      for(let i = 0; i < 30; i++) {
        let product = new Product();
        product.category = category._id;
        product.name = faker.commerce.productName();
        product.price = faker.commerce.price();
        product.image = faker.image.image();
        product.save();
      }
      res.json({message: 'Success'});
    } 
    catch(err) {
      if (err) return next(err);
    }
  });

  app.post('/api/search', async (req, res, next) => {
    const {search_term} = req.body;
    
    Product.search({
      query_string: { query: search_term }
    }, function(err, results) {
      if (err) return next(err);
      res.json(results);
    });
  });
}
