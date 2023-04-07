const auth = require('../../controllers/mongo/auth');
const session = require('../../middlewares/mongo_session');
const router = require('express').Router();

router.post('/login', auth.login);
router.get('/logout', session.auth, auth.logout);

module.exports = router;