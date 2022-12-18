const user = require('../services/user.js');

module.exports = {
    profile: (req, res) => {
        user.getProfile(req.pool, req.user.id)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    },
    unpaid: (req, res) => {
        user.getUnpaid(req.pool, req.user.id)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    }
}