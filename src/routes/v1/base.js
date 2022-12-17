const base = require('../../controllers/base');
const session = require('../../middlewares/session');
const router = require('express').Router();

module.exports = () => {
    router.get('/visits', session.auth, base.visits);
}