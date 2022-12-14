const concerts = require('../../controllers/concerts');
const session = require('../../middlewares/session');
const router = require('express').Router();

router.get('/', session.auth, concerts.get);
router.post('/', session.auth, concerts.add);
router.delete('/:id', session.auth, concerts.delete);
router.post('/pupil', session.auth, concerts.add_pupil);
router.delete('/pupil', session.auth, concerts.delete_pupil);


module.exports = router;
