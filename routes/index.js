var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');
var Order = require('../models/order');


/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function (err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize)); //push array of chunk size
    }
    res.render('shop/index', {title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
  });
});

router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {}); // if cart already exists, pass old cart otherwise empty js object

  Product.findById(productId, function (err, product) {
    if (err){
      return res.redirect('/'); // if err redirect to root page
    }
    cart.add(product, product.id);
    req.session.cart = cart; // will be saved as soon as response has been sent
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/remove/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/reduce/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req, res, next) {
  if(!req.session.cart){ // check if cart exists
    return res.render('shop/shopping-cart', {products: null})
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn,  function (req, res, next) {
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require('stripe')('sk_test_JjbLtKO4MoEaP8o262kiy9OC00PuOWTcrz');

  stripe.charges.create(
      {
        amount: cart.totalPrice * 100, //amount is in cents (or smallest denomination)
        currency: 'eur',
        source: req.body.stripeToken, //obtained with Stripe.js
        description: 'Test Charge',
      },
      function(err, charge) {
        // asynchronously called
        if (err) {
          req.flash('error', err.message);
          return res.redirect('/checkout');
        }
        var order = new Order({
          user: req.user, // whenever signing in with passport it puts user in the request
          cart: cart,
          address: req.body.address,
          name: req.body.name,
          paymentId: charge.id
        });
        order.save(function (err, result) {
          req.flash('success', 'Purchase Successful!');
          req.session.cart = null;
          res.redirect('/');
        });
      });
});

module.exports = router;

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){ //passport manages the authentication state in the session automatically so when successfully logged in it will set  to true
    return next();
  }
  req.session.oldUrl = req.url; // create var oldUrl equal to the url user tried to access
  res.redirect('/user/signin');
}