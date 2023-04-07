const base = require('../../controllers/mongo/base');
const session = require('../../middlewares/mongo_session');
const router = require('express').Router();

router.get('/visits', session.auth, base.visits);

module.exports = router;