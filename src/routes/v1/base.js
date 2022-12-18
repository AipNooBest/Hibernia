const base = require('../../controllers/base');
const session = require('../../middlewares/session');
const router = require('express').Router();

router.get('/visits', session.auth, base.visits);

module.exports = router;