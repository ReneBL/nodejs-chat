var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Users = require('../models/user');

var initialize = function() {
    return passport.initialize();
};

var session = function() {
    return passport.session();
};

var setup = function() {
    passport.use(new LocalStrategy({
            usernameField: 'nickname',
            passwordField: 'pass'
        },
        function(username, password, done) {
            Users.findOne({ username: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                if (!user.pass === password) { return done(null, false); }
                return done(null, user);
            });
        }
    ));

    // Logica de serializacion de usuario en la sesion
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // Deserializacion del usuario de la sesion
    passport.deserializeUser(function(id, done) {
        Users.findOne({_id: id}, function(err, user) {
            if (err) {
                done(err);
            }
            done(null, user);
        })
    });
};

var isLoggedIn = function(req, res, next) {
    if (req.user) {
        // Usuario autenticado
        next();
    }
    res.redirect('/login');
};

module.exports = {
    initialize: initialize,
    session: session,
    setup: setup,
    isLoggedIn: isLoggedIn
}
