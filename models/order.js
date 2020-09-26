var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'}, // store an id here but the id links to the users collection and model
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required: true} //paymentId can be seen on stripe dashboard
});

module.exports = mongoose.model('Order', schema);