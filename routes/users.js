var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var authManager = require('../helpers/authenticationManager');
const { check, validationResult } = require('express-validator/check');
const Constants = require('../helpers/constants.js');

// Check if user is authenticated
router.get('/login', authManager.isLoggedIn(), function (req, res, next) {
    var userinfo = {
        name: req.user.name,
        surname: req.user.surname,
        nickname: req.user.nickname
    }
    res.status(200).json(userinfo);
});

// Do login
router.post('/login', [check('nickname', 'Nickname cannot be blank or empty').not().isEmpty(),
check('pass', 'Password cannot be blank or empty').not().isEmpty()], function (req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: Constants.AUTH_FAIL, message: errors.array() });
    }

    authManager.authenticate(req, res, next);
});

// Do logout
router.get('/logout', authManager.isLoggedIn(), function (req, res, next) {
    req.logout();
    res.end();
});

router.post('/register', [check('name', 'Name cannot be blank or empty').not().isEmpty(),
check('surname', 'Surname cannot be blank or empty').not().isEmpty(),
check('nickname', 'Nickname cannot be blank or empty').not().isEmpty(),
check('pass', 'Password cannot be blank or empty').not().isEmpty()], function (req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: Constants.REGISTRATION_FAIL, message: errors.array() });
    }

    var name = req.body.name;
    var surname = req.body.surname;
    var nickname = req.body.nickname;
    var pass = req.body.pass;

    var user = new User({ name: name, surname: surname, nickname: nickname, pass: pass });
    user.save(function (err, result) {
        if (err) {
            if (err.code == 11000) {
                return res.status(400).json({
                    "error": Constants.REGISTRATION_FAIL,
                    "message": "User already exists"
                });
            }
            next(err);
        }
        authManager.authenticate(req, res, next);
    });
});

router.get('/find', authManager.isLoggedIn(), function (req, res, next) {
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
