const groups = require('../../controllers/groups');
const session = require('../../middlewares/session');
const router = require('express').Router();

module.exports = () => {
    router.get('/', session.auth, groups.get);
    router.get('/:id', session.auth, groups.getById);
    router.get('/schedule', session.auth, groups.schedule);
    // Как вариант добавить на будущее в БД
    // router.get('/:id/schedule', session.auth, groups.scheduleById);
    return router;
}