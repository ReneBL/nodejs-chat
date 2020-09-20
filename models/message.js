const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var msgSchema = new Schema({
    issuer: { type: ObjectId, required: true },
    chat: { type: ObjectId, index: true, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, required: true }
});

module.exports = mongoose.model('Message', msgSchema);
