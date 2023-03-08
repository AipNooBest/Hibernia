const db = require('../../utils/postgres')
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

            db.handle(pool, 'SELECT * FROM get_visits($1, $2, $3, $4)', [start_year, start_month, end_year, end_month])
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    }
}