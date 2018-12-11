process.env.NODE_ENV = 'test';

var app = require('../app');
var db = require('../helpers/db');
var chai = require('chai');
var chaiHttp = require('chai-http');
var User = require('../models/user');
var should = chai.should();

chai.use(chaiHttp);

//var chai = c.request(app);
const USER_NAME = "John";
const USER_SURNAME = "Doe";
const USER_NICKNAME = "JDoe";
const USER_PASSWORD = "1234";

describe("Authentication", function () {
    var r = chai.request.agent(app);

    before(function (done) {
        var user = new User({
            name: USER_NAME, surname: USER_SURNAME,
            nickname: USER_NICKNAME, pass: USER_PASSWORD
        });
        user.save(function (err) {
            done();
        });
    });

    after(function (done) {
        db.dropDatabase().then(() => {
            db.closeConnection().then(() => {
                r.close();
                done();
            });
        });
    });

    describe("Register", function () {
        it("should register expected new user when correct data is passed", function (done) {
            chai.request(app)
                .post('/api/users/register')
                .send({
                    name: 'Usuario', surname: 'Prueba',
                    nickname: 'userP', pass: 'password'
                })
                .end(function (err, res) {
                    res.should.have.cookie("connect.sid");
                    res.should.have.header("Access-Token");
                    res.should.have.status(200);
                    done();
                });
        });
        it("should abort registration if user exists", function (done) {
            chai.request(app)
                .post('/api/users/register')
                .send({
                    name: USER_NAME, surname: USER_SURNAME,
                    nickname: USER_NICKNAME, pass: USER_PASSWORD
                })
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.should.have.json;
                    res.body.should.have.property('error');
                    res.body.should.have.property('message');
                    res.body.error.should.equal('REGISTRATION_FAIL');
                    res.body.message.should.equal('User already exists');
                    done();
                });
        });
        it("should abort registration if invalid data is passed", function (done) {
            chai.request(app)
                .post('/api/users/register')
                .send({
                    name: '', surname: USER_SURNAME, nickname: USER_NICKNAME, pass: USER_PASSWORD
                })
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.should.have.json;
                    res.body.should.have.property('error');
                    res.body.should.have.property('message');
                    res.body.error.should.equal('REGISTRATION_FAIL');

                    var expected = [{
                        "location": "body",
                        "msg": "Name cannot be blank or empty",
                        "param": "name",
                        "value": ""
                    }];
                    chai.expect(res.body.message).to.eql(expected);
                    done();
                });
        });

    });

    describe("Login", function () {

        it("should log in expected registered user", function (done) {
            r.post('/api/users/login')
                .send({ 'nickname': USER_NICKNAME, 'pass': USER_PASSWORD })
                .end(function (err, res) {
                    res.should.have.cookie("connect.sid");
                    res.should.have.header("Access-Token");
                    res.should.have.status(200);
                    done();
                });
        });

        it("should return logged user info", function (done) {
            r.get('/api/users/login')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.have.json;
                    res.body.should.have.property('name');
                    res.body.should.have.property('surname');
                    res.body.should.have.property('nickname');
                    res.body.name.should.equal(USER_NAME);
                    res.body.surname.should.equal(USER_SURNAME);
                    res.body.nickname.should.equal(USER_NICKNAME);
                    done();
                });
        });

        it("should abort log in on incorrect pass", function (done) {
            chai.request(app)
                .post('/api/users/login')
                .send({ 'nickname': USER_NICKNAME, 'pass': '4567' })
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.have.json;
                    res.body.should.have.property('error');
                    res.body.should.have.property('message');
                    res.body.error.should.equal('AUTH_FAIL');
                    res.body.message.should.equal('Incorrect user/password.');
                    done();
                });
        });
        it("should abort log in on user not found", function (done) {
            chai.request(app)
                .post('/api/users/login')
                .send({ 'nickname': 'user', 'pass': '4567' })
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.have.json;
                    res.body.should.have.property('error');
                    res.body.should.have.property('message');
                    res.body.error.should.equal('AUTH_FAIL');
                    res.body.message.should.equal('Incorrect user/password.');
                    done();
                });
        });
        it("should abort log in on invalid data", function (done) {
            chai.request(app)
                .post('/api/users/login')
                .send({ 'nickname': 'user', 'pass': '' })
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.should.have.json;
                    res.body.should.have.property('error');
                    res.body.should.have.property('message');
                    res.body.error.should.equal('AUTH_FAIL');

                    var expected = [{
                        "location": "body",
                        "msg": "Password cannot be blank or empty",
                        "param": "pass",
                        "value": ""
                    }];
                    chai.expect(res.body.message).to.eql(expected);

                    done();
                });
        });
    });
    describe("Logout", function () {

        before("Login registered user", function (done) {
            r.post('/api/users/login')
                .send({ 'nickname': USER_NICKNAME, 'pass': USER_PASSWORD })
                .end(function (err, res) {
                    done();
                });
        });

        it("should logout successfully if user is already logged in", function (done) {
            r.get("/api/users/logout")
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.not.have.cookie("connect.sid");
                    res.should.not.have.header("Access-Token");
                    done();
                });
        });

        it("should try to logout but get expected redirection to login instead", function (done) {
            chai.request(app).get("/api/users/logout")
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });
    });
});
