const auth = require('../../controllers/postgres/auth');
const session = require('../../middlewares/postgres_session');
const router = require('express').Router();

router.post('/login', auth.login);
router.get('/logout', session.auth, auth.logout);

module.exports = router;