const db = require('../utils/database')

module.exports = {
    getProfile: (pool) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'SELECT * FROM view_pupils')
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    getUnpaid: (pool) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'SELECT * FROM view_unpaid_visits')
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    }
}