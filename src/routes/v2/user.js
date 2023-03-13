const user = require('../../controllers/mongo/user.js');
const session = require('../../middlewares/mongo_session');
const router = require('express').Router();


router.get('/unpaid', session.auth, user.unpaid);

module.exports = router;