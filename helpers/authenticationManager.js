var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Users = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
const Constants = require('../helpers/constants.js');

var initialize = function () {
    return passport.initialize();
};

var session = function () {
    return passport.session();
};

var setup = function () {
    passport.use(new LocalStrategy({
        usernameField: 'nickname',
        passwordField: 'pass'
    },
        function (username, password, done) {
            Users.findOne({ nickname: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user || (user.pass != password)) { return done(null, false, { message: 'Incorrect user/password.' }); }
                return done(null, user);
            });
        }
    ));

    // User's in-session serialization logic
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    // User's deserialization logic
    passport.deserializeUser(function (id, done) {
        Users.findOne({ _id: id }, function (err, user) {
            if (err) {
                done(err);
            }
            done(null, user);
        })
    });
};

var authenticate = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(401).send({ error: Constants.AUTH_FAIL, message: info.message }); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
            }, config.secret);
            return res.append('Access-Token', token).status(200).end();
        });
    })(req, res, next);
};

var isLoggedIn = function () {
    return function (req, res, next) {
        if (req.user) {
            // Authenticated user
            next();
        } else {
            res.status(401).end();
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
