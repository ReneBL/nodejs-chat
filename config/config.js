var config = {
    development: {
        secret: "DEV::PUT_YOUR_SECRET",
        dbUrl: "mongodb://localhost/nodejs-chat-dev"
    },
    production: {
        secret: "PRO::PUT_YOUR_SECRET",
        dbUrl: "mongodb://localhost/nodejs-chat"
    },
    test: {
        secret: "TEST::PUT_YOUR_SECRET",
        dbUrl: "mongodb://localhost/nodejs-chat-test"
    }
};

// This function must be called once in the application, since it access
// process.env (better performance)
var init = function () {
    var env = process.env.NODE_ENV || 'development';
    return config[env];
}

module.exports = init();
