var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

router.post('/login', function(req, res, next) {

});

router.get('/logout', function(req, res, next) {

});

router.post('/register', function(req, res, next) {
    var name = req.body.name;
    var surname = req.body.surname;
    var nickname = req.body.nickname;
    var pass = req.body.pass;

});

router.get('/find', function(req, res, next) {
    // Obtener de la request el parametro 'name'

    // Buscar usuarios cuyo nombre/apellidos o login concuerden con la palabra clave

    // Devolver resultados
});

module.exports = router;
