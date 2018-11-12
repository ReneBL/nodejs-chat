import jwt from 'jsonwebtoken';

const AUTH_TOKEN_KEY = "auth_token";

function login(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
}

function isExpired(token) {
    const dec = jwt.decode(token);

    const date = new Date(0);
    date.setUTCSeconds(dec.exp);

    return !dec.exp || (date < new Date());
}

function isAuthenticated() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    return token && !isExpired(token);
}

export { login, logout, isAuthenticated }