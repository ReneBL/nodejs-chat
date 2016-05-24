var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var authManager = require('../helpers/authenticationManager');

// Show login page
router.get('/login', function(req, res) {
    res.render('login');
});

// Do login
router.post('/login', authManager.authenticate(), function(req, res) {
    // Successful login, redirecting...
    var previous = req.session.previousPage ? req.session.previousPage : '/';
    delete req.session.previousPage;
    res.redirect(previous);
});

// Do logout
router.get('/logout', authManager.isLoggedIn, function(req, res, next) {
    req.logout();
    res.redirect('/');
});

router.post('/register', function(req, res, next) {
    var name = req.body.name;
    var surname = req.body.surname;
    var nickname = req.body.nickname;
    var pass = req.body.pass;

    var user = new User({name: name, surname: surname, nickname: nickname, pass: pass});
    user.save(function(err, result) {
        if (err) next(err);
        next();
    });
});

router.get('/find', authManager.isLoggedIn, function(req, res, next) {
    // Obtener de la request el parametro 'name'
    var name = req.query.name;
    if (!name) next();

    // Buscar usuarios cuyo nombre/apellidos o login concuerden con la palabra clave
    var regExp = new RegExp(name, 'i');
    User.find({$or: [{name: {$regex: regExp}}, {surname: {$regex: regExp}}]},
        {"_id": 0, "name":1, "surname":1, "nickname":1},
        function(err, result) {
            console.log('Found result: ', result);
            if (err) next(err);
            res.json(result);
        }
    );
});

module.exports = router;
