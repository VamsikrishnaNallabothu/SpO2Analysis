var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var categoryItemsSchema   = new Schema({
    name: String,
    imageUrl: String,
    price: Number,
    quantityRemaining: Number,
    categoryId: String,
    categoryName: String
});

module.exports = mongoose.model('categoryItems', categoryItemsSchema);