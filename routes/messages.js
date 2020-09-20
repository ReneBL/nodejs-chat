const express = require('express');
const router = express.Router();
const authManager = require('../helpers/authenticationManager');
const { check, validationResult } = require('express-validator/check');
const Messages = require('../models/message');
const Chats = require('../models/chat');
const Constants = require('../helpers/constants.js');

router.post('/', [authManager.isLoggedIn(),
check('chat', 'Chat cannot be blank or empty').not().isEmpty(),
check('content', 'Message content cannot be blank or empty').not().isEmpty()
], function (req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: Constants.INCORRECT_REQUEST, message: errors.array() });
    }

    Chats.findById(req.body.chat, function (err, c) {
        if (err) { return next(err) };
        if (!c) {
            return res.status(400).json({ error: Constants.CHAT_NOT_EXISTS, message: "Chat does not exist. Message is going to be ignored." })
        }

        Messages.create({ issuer: req.user._id, chat: c._id, content: req.body.content, timestamp: Date.now() }, function (err, d) {
            if (err) {
                return next(err);
            }
            res.status(201).end();
        });
    });
});

// TODO: Autenticado
router.get('/messages', authManager.isLoggedIn(), function (req, res) {
    // WEB SOCKETS?
    // Recuperar usuario que quiere consultar sus mensajes de la request
});

module.exports = router;