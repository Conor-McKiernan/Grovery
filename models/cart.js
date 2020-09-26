//constructor function with exports to make it available outside file
module.exports = function Cart(oldCart) { // whenever we recreate a cart we pass the old one in
    this.items = oldCart.items || {}; // giving cart flexibility to assign the right values depending on whether its brand new or not
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice= oldCart.totalPrice  || 0;

    this.add = function (item, id) {
        var storedItem  = this.items[id];
        if (!storedItem){ //if item not stored already
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.reduceByOne = function (id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if (this.items[id].qty <= 0){
            delete this.items[id];
        }
    };

    this.removeItem = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.generateArray = function () {
        var arr = [];
        for (var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};