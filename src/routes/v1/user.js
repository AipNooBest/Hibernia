const user = require('../../controllers/user.js');
const session = require('../../middlewares/session');
const router = require('express').Router();


router.get('/profile', session.auth, user.profile);
router.get('/unpaid', session.auth, user.unpaid);
router.delete('/:username', session.auth, user.delete);
router.post('/new', session.auth, user.new);

module.exports = router;