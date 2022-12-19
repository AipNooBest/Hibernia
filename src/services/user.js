const db = require('../utils/database')
const security = require('../utils/security')

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
    },
    delete: (pool, username) => {
        return new Promise((resolve, reject) => {
            username = security.sanitizeString(username);
            db.handle(pool, 'CALL delete_pupil($1)', [username])
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    }
}