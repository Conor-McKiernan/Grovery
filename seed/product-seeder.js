var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://mongodb5062mc:ke3qyp@danu7.it.nuigalway.ie:8717/mongodb5062', { useNewUrlParser: true, useUnifiedTopology: true});

var products = [
    new Product({
        imagePath: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/shopping-bag-full-of-fresh-vegetables-and-fruits-royalty-free-image-1128687123-1564523576.jpg?crop=0.669xw:1.00xh;0.300xw,0&resize=640:*',
        title: 'Vegetables',
        description: 'Get yo veggies!!!',
        price: 10
    }),
    new Product({
        imagePath: 'https://media-cdn.tripadvisor.com/media/photo-s/15/dd/20/61/al-punto.jpg',
        title: 'Meat',
        description: 'Get yo meat!!!',
        price: 21
    }),
    new Product({
        imagePath: 'https://www.spendwithpennies.com/wp-content/uploads/2019/04/Fruit-Salad-SWP-500x500.jpg',
        title: 'Fruit',
        description: 'Get yo fruit!!!',
        price: 5
    }),
    new Product({
        imagePath: 'https://ofbatteranddough.com/wp-content/uploads/2017/03/Homemade-white-sandwich-bread-12.jpg',
        title: 'Baked Goods',
        description: 'Get yo baked goods!!!',
        price: 7
    }),
    new Product({
        imagePath: 'https://www.tgifridays.co.uk/images/static/categories/all-drinks.jpg',
        title: 'Drinks',
        description: 'Get yo drinks!!!',
        price: 15
    }),
    new Product({
        imagePath: 'https://www.healthline.com/hlcmsresource/images/AN_images/AN480-Eggs-Dairy-732x549-thumb.jpg',
        title: 'Dairy, Milk & Eggs',
        description: 'Get yo dairy, milk and eggs!!!',
        price: 21
    })
];

var done = 0;
for (var i = 0; i < products.length; i++){
    products[i].save(function (err, result) {
        done++;
        if (done === products.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}