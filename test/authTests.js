process.env.NODE_ENV = 'test';

var app = require('../app');
var db = require('../helpers/db');
var chai = require('chai');
var chaiHttp = require('chai-http');
var User = require('../models/user');
var should = chai.should();

chai.use(chaiHttp);

//var chai = c.request(app);

describe("Authentication", function () {

    before(function (done) {
        var user = new User({
            name: 'Perico', surname: 'Palotes',
            nickname: 'PericoP', pass: '1234'
        });
        user.save(function (err) {
            done();
        });
    });

    after(function (done) {
        db.dropDatabase();
        done();
    });

    describe("Register", function () {
        it("should register a new user", function (done) {
            chai.request(app)
                .post('/api/users/register')
                .send({
                    name: 'Usuario', surname: 'Prueba',
                    nickname: 'userP', pass: 'password'
                })
                .end(function (err, res) {
                    res.should.have.cookie("connect.sid");
                    res.should.have.status(200);
                    done();
                });
        });
        it("should abort registration if user exists", function (done) {
            chai.request(app)
                .post('/api/users/register')
                .send({
                    name: 'Perico', surname: 'Palotes',
                    nickname: 'PericoP', pass: '1234'
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

    });

    describe("Login", function () {

        var r = chai.request.agent(app);

        it("should log in a registered user", function (done) {
            r.post('/api/users/login')
                .send({ 'nickname': 'PericoP', 'pass': '1234' })
                .end(function (err, res) {
                    res.should.have.cookie("connect.sid");
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
                    res.body.name.should.equal('Perico');
                    res.body.surname.should.equal('Palotes');
                    res.body.nickname.should.equal('PericoP');
                    done();
                });
        });

        it("should abort log in on incorrect pass", function (done) {
            chai.request(app)
                .post('/api/users/login')
                .send({ 'nickname': 'PericoP', 'pass': '4567' })
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.should.have.json;
                    res.body.should.have.property('error');
                    res.body.should.have.property('message');
                    res.body.error.should.equal('AUTH_FAIL');
                    res.body.message.should.equal('Incorrect password.');
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
                    res.body.message.should.equal('Username does not exists.');
                    done();
                });
        });
    });
    describe("Logout", function () {

        var r = chai.request.agent(app);

        before("Login registered user", function (done) {
            r.post('/api/users/login')
                .send({ 'nickname': 'PericoP', 'pass': '1234' })
                .end(function (err, res) {
                    done();
                });
        });

        it("should logout successfully if user is already logged in", function (done) {
            r.get("/api/users/logout")
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.not.have.cookie("connect.sid");
                    done();
                });
        });

        it("should try to logout but get a redirection to login instead", function (done) {
            chai.request(app).get("/api/users/logout")
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });
    });
});
