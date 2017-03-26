var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProductsSchema   = new Schema({
    category: String,
    item: String,
    totalQuantity: String,
    imageUrl: String
});

module.exports = mongoose.model('ProductObj', ProductsSchema);