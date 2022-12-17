const groups = require('../services/groups');

module.exports = {
    get: (req, res) => {
        groups.get(req.pool)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    },
    getById: (req, res) => {
        groups.getById(req.pool, req.params.id)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    },
    schedule: (req, res) => {
        groups.getSchedule(req.pool, req.params.id)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    }

}