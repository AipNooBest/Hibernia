const auth = require('../../controllers/auth');
const session = require('../../middlewares/session');
const router = require('express').Router();

router.route('/login').post(auth.login);
router.route('/logout').get(session.auth, auth.logout);

module.exports = router;