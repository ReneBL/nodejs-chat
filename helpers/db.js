var mongoose = require('mongoose');
var config = require('../config/config');
var debug = require('debug')('nodejs-chat:db');

var configureConnection = function() {
    mongoose.connect(config.dbUrl);
}

var getConnection = function() {
    return mongoose.connection;
}

module.exports = {
    configureConnection: configureConnection,
    getConnection: getConnection
}
