const user = require('../../controllers/postgres/user.js');
const session = require('../../middlewares/postgres_session');
const router = require('express').Router();


router.get('/profile', session.auth, user.profile);
router.get('/unpaid', session.auth, user.unpaid);
router.get('/list', session.auth, user.list);
router.get('/:username', session.auth, user.getByUsername);
router.delete('/:username', session.auth, user.delete);
router.post('/new', session.auth, user.new);

module.exports = router;