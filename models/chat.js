const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var chatSchema = new Schema({
    name: { type: String, required: true },
    participants: [{
        nickname: String
    }],
    createdAt: { type: Date, required: true }
});

module.exports = mongoose.model('Chat', chatSchema);