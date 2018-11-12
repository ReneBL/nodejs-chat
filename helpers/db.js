var mongoose = require('mongoose');
var config = require('../config/config');

var configureConnection = function () {
    mongoose.connect(config.dbUrl, { useMongoClient: true });
}

var getConnection = function () {
    return mongoose.connection;
}

var dropDatabase = function () {
    return getConnection().db.dropDatabase();
}

var closeConnection = function () {
    return getConnection().close();
}

module.exports = {
    configureConnection: configureConnection,
    dropDatabase: dropDatabase,
    getConnection: getConnection,
    closeConnection: closeConnection
}
