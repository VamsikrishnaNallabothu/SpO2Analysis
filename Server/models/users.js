var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UsersSchema   = new Schema({
    name: String,
    email: String,
    age: Number,
    userId: String
});

module.exports = mongoose.model('UserObj', UsersSchema);