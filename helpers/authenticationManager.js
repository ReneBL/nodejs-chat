var Users = require('../models/user');
var jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');
var config = require('../config/config');

var configure = function () {
    return expressJWT({
        secret: config.secret,
        credentialsRequired: false,
        getToken: function (req) {
            // First, try to extract token from 'Authorization: Bearer...' header
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                return req.headers.authorization.split(' ')[1];
            } else if (req.cookies && req.cookies.auth_token) {
                // Extract token from 'auth_token' cookie if exists
                return req.cookies.auth_token;
            }
        }
    });
}

var authenticate = function (req, res, next) {

    var username = req.body.nickname;
    var password = req.body.pass;

    if (!username) {
        res.status(400).send({ error: "AUTH_FAIL", message: "Username required" });
    }

    if (!password) {
        res.status(400).send({ error: "AUTH_FAIL", message: "Password required" });
    }

    Users.findOne({ nickname: username }, function (err, user) {
        if (err) throw err;
        if (!user) {
            return res.status(401).send({ error: "AUTH_FAIL", message: "Username does not exists." });
        }
        if (user.pass != password) {
            return res.status(401).send({ error: "AUTH_FAIL", message: "Incorrect password." });
        }
        var token = jwt.sign({ usr: username, name: user.name }, config.secret);
        res.cookie("auth_token", token, { httpOnly: true });
        res.redirect('/');

    });

};

var isLoggedIn = function (redirection) {
    return function (req, res, next) {
        var mid = expressJWT({ secret: config.secret });
        mid(req, res, function () {
            console.log(req.headers)
            if (req.user) {
                // Usuario autenticado
                next();
            } else {
                res.redirect(redirection);
            }
        });
    };
};

module.exports = {
    authenticate: authenticate,
    isLoggedIn: isLoggedIn,
    configure: configure
}
