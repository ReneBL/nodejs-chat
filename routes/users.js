var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var authManager = require('../helpers/authenticationManager');

// Show login page
router.get('/login', function (req, res) {
    res.render('login');
});

// Do login
router.post('/login', function (req, res, next) {
    authManager.authenticate(req, res, next);
});

// Do logout
router.get('/logout', authManager.isLoggedIn('/users/login'), function (req, res, next) {
    res.clearCookie("auth_token");
    res.redirect('/');
});

router.post('/register', function (req, res, next) {
    var name = req.body.name;
    var surname = req.body.surname;
    var nickname = req.body.nickname;
    var pass = req.body.pass;

    var user = new User({ name: name, surname: surname, nickname: nickname, pass: pass });
    user.save(function (err, result) {
        if (err) {
            if (err.code == 11000) {
                return res.status(400).json({ "error": "REGISTRATION_FAIL", "message": "User already exists" });
            }
            next(err);
        }
        authManager.authenticate(req, res, next);
    });
});

router.get('/find', authManager.isLoggedIn('/users/login'), function (req, res, next) {
    // Obtener de la request el parametro 'name'
    var name = req.query.name;
    if (!name) next();

    // Buscar usuarios cuyo nombre/apellidos o login concuerden con la palabra clave
    var regExp = new RegExp(name, 'i');
    User.find({ $or: [{ name: { $regex: regExp } }, { surname: { $regex: regExp } }] },
        { "_id": 0, "name": 1, "surname": 1, "nickname": 1 },
        function (err, result) {
            if (err) next(err);
            res.json(result);
        }
    );
});

module.exports = router;
