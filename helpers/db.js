var mongoose = require('mongoose');
var config = require('../config/config');

var configureConnection = function() {
    mongoose.connect(config.dbUrl);
}

var getConnection = function() {
    return mongoose.connection;
}

var dropDatabase = function() {
    mongoose.connection.db.dropDatabase();
}

module.exports = {
    configureConnection: configureConnection,
    dropDatabase: dropDatabase,
    getConnection: getConnection
}
