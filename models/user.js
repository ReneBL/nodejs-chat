var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, required: true},
    surname: String,
    nickname: {type: String, unique: true, index: true, required: true},
    pass: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);
