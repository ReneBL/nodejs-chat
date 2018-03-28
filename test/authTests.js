process.env.NODE_ENV = 'test';

var app = require('../app');
var db = require('../helpers/db');
var c = require('chai');
var chaiHttp = require('chai-http');
var User = require('../models/user');
var should = c.should();

c.use(chaiHttp);

var chai = c.request.agent(app);

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

    describe("Login", function () {
        it("should log in a registered user", function (done) {
            chai.post('/users/login')
                .send({ 'nickname': 'PericoP', 'pass': '1234' })
                .end(function (err, res) {
                    res.should.to.redirect;
                    res.should.have.status(200);
                    done();
                });
        });
        it("should abort log in on incorrect pass", function (done) {
            chai.post('/users/login')
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
            chai.post('/users/login')
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
    describe("Register", function () {
        it("should register a new user", function (done) {
            chai.post('/users/register')
                .send({
                    name: 'Usuario', surname: 'Prueba',
                    nickname: 'userP', pass: 'password'
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.to.redirect;
                    done();
                });
        });
        it("should abort registration if user exists", function (done) {
            chai.post('/users/register')
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
    describe("Logout", function () {

        before("Login registered user", function (done) {
            chai.post('/users/login')
                .send({ 'nickname': 'PericoP', 'pass': '1234' })
                .redirects(0)
                .end(function (err, res) {
                    done();
                });
        });

        it("should logout successfully if user is already logged in", function (done) {
            chai.get("/users/logout")
                .redirects(0)
                .end(function (err, res) {
                    res.should.to.redirectTo("/");
                    res.should.not.have.cookie("connect.sid");
                    res.should.have.status(302);
                    done();
                });
        });

        it("should try to logout but get a redirection to login instead", function (done) {
            chai.get("/users/logout")
                .redirects(0)
                .end(function (err, res) {
                    res.should.to.redirectTo("/users/login");
                    res.should.not.have.cookie("connect.sid");
                    res.should.have.status(302);
                    done();
                });
        });
    });
});
