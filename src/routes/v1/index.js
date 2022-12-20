const express = require('express');
const router = express.Router();
const auth = require('./auth');
const base = require('./base');
const groups = require('./groups');
const user = require('./user');
const concerts = require('./concerts');
const costumes = require('./costumes');

router.get('/status', (req, res) => {
    res.json({
        message: 'OK',
        timestamp: new Date().toISOString(),
        IP: req.ip,
        URL: req.originalUrl,
    });
});

router.use('/', auth);
router.use('/', base);
router.use('/groups', groups);
router.use('/user', user);
router.use('/concerts', concerts);
router.use('/costumes', costumes);

module.exports = router;