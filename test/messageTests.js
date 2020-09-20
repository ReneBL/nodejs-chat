process.env.NODE_ENV = 'test';

var app = require('../app');
var db = require('../helpers/db');
var chai = require('chai');
var chaiHttp = require('chai-http');
var User = require('../models/user');
var Chat = require('../models/chat');
var Message = require('../models/message');
var should = chai.should();
var assert = require('chai').assert;

chai.use(chaiHttp);

const USER_NAME = "John";
const USER_SURNAME = "Doe";
const USER_NICKNAME = "JDoe";
const USER_PASSWORD = "1234";
var CHAT;

describe("Messages", function () {
    var r = chai.request.agent(app);

    before(function (done) {
        var user = new User({
            name: USER_NAME, surname: USER_SURNAME,
            nickname: USER_NICKNAME, pass: USER_PASSWORD
        });
        user.save(function (e, result) {
            if (e) {
                done(e);
            }
            r.post('/api/users/login')
                .send({ 'nickname': USER_NICKNAME, 'pass': USER_PASSWORD })
                .end(function (err, response) {
                    if (err) {
                        done(err);
                    }
                    response.should.have.cookie("connect.sid");
                    response.should.have.header("Access-Token");
                    response.should.have.status(200);

                    var chat = new Chat({
                        name: "ChatName", participants: [{ nickname: "mocknickname1" }, { nickname: "mocknickname2" }],
                        createdAt: Date.now()
                    });
                    chat.save(function (error, c) {
                        if (error) {
                            return done(error);
                        }
                        CHAT = c;
                        done();
                    });
                });
        });
    });

    after(function (done) {
        db.dropDatabase().then(() => {
            r.close();
            done();
        });
    });

    describe("Creation", function () {
        it("should create a new message when chat does exists", function (done) {
            r.post('/api/messages')
                .send({ 'chat': CHAT._id, 'content': "My first message!" })
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    }
                    res.should.have.status(201);

                    Message.findOne({ chat: CHAT._id }, function (e, result) {
                        if (e) {
                            done(e);
                        }
                        assert.equal(result.content, "My first message!");
                        done();
                    });
                });
        });
    });

});