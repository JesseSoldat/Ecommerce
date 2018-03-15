module.exports = (app, Category, Product, Cart) => {

  Product.createMapping((err, mapping) => {
    if (err) {
      console.log("error creating mapping");
      console.log(err);
    } else {
      console.log("Mapping created");
      console.log(mapping);
    }
  });

  const stream = Product.synchronize();
  let count = 0;

  stream.on('data', () => count++);
  stream.on('close', () => console.log(`Indexed ${count} documents`));
  stream.on('error', () => console.log(err));

  app.get('/', (req, res, next) => {
    if(req.user) {
      paginate(Product, req, res, next);
    } else {
      res.render('main/home');
    }
  });

  app.get('/page/:page', (req, res, next) => {
    const page = req.params.page;
    paginate(Product, req, res, next, page);
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
      // console.log(product);
      
      res.render('main/product', {product});
    } 
    catch(err) {
      return next(err);
    }
  });

  app.post('/product/:id', async (req, res, next) => {
    try {
     const cart = await Cart.findOne({owner: req.user._id});
     const price = parseFloat(req.body.priceValue);
     cart.items.push({
       item: req.body.product_id,
       price,
       quantity: parseInt(req.body.quantity)
     });
     cart.total = (cart.total + price).toFixed(2); 
     await cart.save();
     res.redirect('/cart');
    } 
    catch (err) {
      next(err);
    }
  });

  app.post('/search', (req, res, next) => {  
    res.redirect(`/search?q=${req.body.q}`);
  });

  app.get('/search', (req, res, next) => {
    const query = req.query.q;
    if(req.query.q) {
      Product.search({
        query_string: { query }
      }, (err, results) => {
        if(err) return next(err);
        const data = results.hits.hits.map(hit => hit);
        res.render('main/search-results', {
          query,
          data
        });
      });
    }
  });

  app.get('/cart', (req, res, next) => {
    Cart
      .findOne({owner: req.user._id})
      .populate('items.item')
      .exec((err, foundCart) => {
        console.log('get /cart', foundCart);       
        if(err) return next(err);
        res.render('main/cart', {
          foundCart,
          success: req.flash('success')
        });
      });
  });

  app.post('/remove', async (req, res, next) => {
    try {
      const foundCart = await Cart.findOne({owner: req.user._id});
      foundCart.items.pull(String(req.body.item));
      foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
      await foundCart.save();
      req.flash('success', 'Successfully removed item');
      res.redirect('/cart');
    } 
    catch (err) {
      next(err);
    }
  });
}

function paginate(Product, req, res, next, page = 1) {
  const perPage = 6;

  Product
    .find({})
    .skip(perPage * page)
    .limit(perPage)
    .populate('category')
    .exec((err, products) => {
      if(err) return next(err);
      Product.count().exec((err, count) => {
        if(err) return next(err);
        res.render('main/product-main', {
          page,
          products,
          pages: count / perPage    
        });
      });
    });
}