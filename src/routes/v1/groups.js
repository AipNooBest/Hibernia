const groups = require('../../controllers/groups');
const session = require('../../middlewares/session');
const router = require('express').Router();

router.get('/', session.auth, groups.get);
router.get('/schedule', session.auth, groups.schedule);
router.get('/:id', session.auth, groups.getById);
// Как вариант добавить на будущее в БД
// router.get('/:id/schedule', session.auth, groups.scheduleById);

module.exports = router;