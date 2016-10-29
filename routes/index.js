var express = require('express');
var authManager = require('../helpers/authenticationManager');
var router = express.Router();

/* GET home page. */
router.get('/', authManager.isLoggedIn('/welcome'), function(req, res) {
    res.render('index');
});

router.get('/welcome', function(req, res) {
    res.render('welcome');
});

module.exports = router;
