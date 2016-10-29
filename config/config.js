var config = {
    development: {
        secret: "keyboard cat",
        dbUrl: "mongodb://localhost/nodejs-chat-dev"
    },
    production: {
        secret: "keyboard cat production",
        dbUrl: "mongodb://localhost/nodejs-chat"
    },
    test: {
        secret: "keyboard cat test",
        dbUrl: "mongodb://localhost/nodejs-chat-test"
    }
};

// This function must be called once in the application, since it access
// process.env (better performance)
var init = function() {
    var env = process.env.NODE_ENV || 'development';
    return config[env];
}

module.exports = init();
