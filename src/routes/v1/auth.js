const auth = require('../../controllers/auth');
const session = require('../../middlewares/session');
const router = require('express').Router();

router.post('/login', auth.login);
router.get('/logout', session.auth, auth.logout);

module.exports = router;