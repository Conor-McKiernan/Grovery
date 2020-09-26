var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({user: req.user}, function (err, orders) { // comparing the user that passport stores for us to the one in the database
        if (err){
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', { orders: orders });
    });
});

router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) { //acts as filter in front of the other routes
    next();
});

router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true // flash message using flash package
}),function (req, res, send) {
    if (req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null; // clear old url so it isn't stored
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile')
    }
});

router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, send) {
    if (req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null; // clear old url so it isn't stored
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile')
    }
});

module.exports = router;

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){ //passport manages the authentication state in the session automatically so when successfully logged in it will set  to true
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next){
    if (!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}