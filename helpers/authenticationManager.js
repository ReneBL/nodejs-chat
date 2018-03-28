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
            Users.findOne({ nickname: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Username does not exists.' }); }
                if (user.pass != password) { return done(null, false, { message: 'Incorrect password.' }); }
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

var authenticate = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(401).send({error : "AUTH_FAIL", message : info.message}); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
};

var isLoggedIn = function(redirection) {
    return function(req, res, next) {
        if (req.user) {
            // Usuario autenticado
            next();
        } else {
            res.redirect(redirection);
        }
    };
};

module.exports = {
    initialize: initialize,
    session: session,
    setup: setup,
    authenticate: authenticate,
    isLoggedIn: isLoggedIn
}
