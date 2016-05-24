var express = require('express');
var router = express.Router();
var authManager = require('../helpers/authenticationManager');

// TODO: Autenticado
router.post('/message', authManager.isLoggedIn(), function(req, res) {
    // Recuperar destinatario del mensaje de la request
});

// TODO: Autenticado
router.get('/messages', authManager.isLoggedIn(), function(req, res) {
    // WEB SOCKETS?
    // Recuperar usuario que quiere consultar sus mensajes de la request
});
