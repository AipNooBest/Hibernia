const db = require('../../utils/mongo')
const { isValidYear, isValidMonth } = require('../../utils/security')

module.exports = {
    visits: (pool, start_year, start_month, end_year, end_month) => {
        return new Promise((resolve, reject) => {
            if (!start_year || !start_month)
                return reject({ code: 400, error: 'Start date is required' });
            if (!end_year) end_year = new Date().getFullYear();
            if (!end_month) end_month = new Date().getMonth();
            if (!isValidYear(start_year) || !isValidMonth(start_month) || !isValidYear(end_year) || !isValidMonth(end_month))
                return reject({ code: 400, error: 'Dates must be valid integers' });
            if (start_year > end_year || (start_year === end_year && start_month > end_month))
                return reject({ code: 400, error: 'Start date must be before end date' });

            db.handle(pool, {
                    find: "visits",
                    filter: {
                        year: {
                            $gte: parseInt(start_year),
                            $lte: parseInt(end_year)
                        },
                        month: {
                            $gte: parseInt(start_month),
                            $lte: parseInt(end_month)
                        }
                    },
                    projection: {_id: 0, person: 1, year: 1, month: 1, visits: 1}
                })
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    }
}