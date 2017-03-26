var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CategoriesSchema   = new Schema({
    name: String,
    imageUrl: String
});

module.exports = mongoose.model('CategoryObj', CategoriesSchema);