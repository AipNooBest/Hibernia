const user = require('../../controllers/user.js');
const session = require('../../middlewares/session');
const router = require('express').Router();


router.get('/profile', session.auth, user.profile);
router.get('/unpaid', session.auth, user.unpaid);
router.delete('/:username', session.auth, user.delete);
// Потом добавлю, я оч устал уже -.-'
// router.get('/:id', session.auth, user.get);

module.exports = router;