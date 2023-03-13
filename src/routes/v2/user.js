const user = require('../../controllers/mongo/user.js');
const session = require('../../middlewares/mongo_session');
const router = require('express').Router();


router.get('/unpaid', session.auth, user.unpaid);
router.post('/new', session.auth, user.new);

module.exports = router;