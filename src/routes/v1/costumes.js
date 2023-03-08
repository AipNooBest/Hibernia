const costumes = require('../../controllers/postgres/costumes');
const session = require('../../middlewares/postgres_session');
const router = require('express').Router();

router.get('/', session.auth, costumes.get);
router.post('/', session.auth, costumes.add);
router.delete('/:id', session.auth, costumes.delete);
router.post('/pupil', session.auth, costumes.addPupil);
router.delete('/pupil', session.auth, costumes.deletePupil);
router.get('/ownership', session.auth, costumes.ownership);

module.exports = router;
