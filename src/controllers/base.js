const base = require('../services/base');

module.exports = {
    visits: (req, res) => {
        let { start_year, start_month , end_year, end_month } = req.query;
        base.visits(req.pool, start_year, start_month, end_year, end_month)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    }
}