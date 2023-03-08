const base = require('../../controllers/postgres/base');
const session = require('../../middlewares/postgres_session');
const router = require('express').Router();

router.get('/visits', session.auth, base.visits);

module.exports = router;