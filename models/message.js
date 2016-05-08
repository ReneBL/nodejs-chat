var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var msgSchema = new Schema({
    sender: String,
    receiver:[String],
    msg: String,
    time: Date
});

module.exports = mongoose.model('Message', msgSchema);
