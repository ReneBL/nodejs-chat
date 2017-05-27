//@ts-check
process.env.NODE_ENV = 'test';

var app = require('../app');
var db = require('../helpers/db');
var chai = require('chai');
var chaiHttp = require('chai-http')
var User = require('../models/user');
var Cookie = require('cookiejar');
var should = chai.should();

chai.use(chaiHttp);

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
            chai.request(app)
                .post('/users/login')
                .redirects(0)
                .send({ 'nickname': 'PericoP', 'pass': '1234' })
                .end(function (err, res) {
                    res.should.to.redirectTo("/");
                    res.should.have.status(302);
                    res.should.have.cookie("auth_token");
                    done();
                });
        });
        it("should display principal page on authenticated user", function (done) {
            chai.request(app)
                .post('/users/login')
                .send({ 'nickname': 'PericoP', 'pass': '1234' })
                .redirects(0)
                .end(function (err, res) {
                    var cookieJar = new Cookie.CookieJar();
                    cookieJar.setCookies(res.headers["set-cookie"]);
                    var authToken = cookieJar.getCookie("auth_token", new Cookie.CookieAccessInfo()).value;
                    chai.request(app)
                        .get('/')
                        .set('Authorization', 'Bearer ' + authToken)
                        .end(function (err, res) {
                            res.should.not.to.redirect;
                            res.should.have.status(200);
                            done();
                        });

                });
        });
        it("should abort log in on incorrect pass", function (done) {
            chai.request(app)
                .post('/users/login')
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
                .post('/users/login')
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
            chai.request(app)
                .post('/users/register')
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
            chai.request(app)
                .post('/users/register')
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
        var token;

        before("Retrieve authenticated user token", function (done) {
            chai.request(app)
                .post('/users/login')
                .send({ 'nickname': 'PericoP', 'pass': '1234' })
                .redirects(0)
                .end(function (err, res) {
                    var cookieJar = new Cookie.CookieJar();
                    cookieJar.setCookies(res.headers["set-cookie"]);
                    token = cookieJar.getCookie("auth_token", new Cookie.CookieAccessInfo()).value;
                    done();
                });
        });

        it("should redirect to login page if user is not logged in yet", function (done) {
            chai.request(app)
                .get("/users/logout")
                .redirects(0)
                .end(function (err, res) {
                    res.should.to.redirectTo("/users/login");
                    res.should.have.status(302);
                    done();
                });
        });
        it("should logout successfully if user is already logged in", function (done) {
            chai.request(app)
                .get("/users/logout")
                .set('Authorization', 'Bearer ' + token)
                .redirects(0)
                .end(function (err, res) {
                    res.should.to.redirectTo("/");
                    res.should.not.have.cookie("auth_token");
                    res.should.have.status(302);
                    done();
                });
        });
    })
});