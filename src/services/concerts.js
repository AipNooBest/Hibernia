const db = require('../utils/database')

module.exports = {
    get: (pool) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'SELECT * FROM view_concerts')
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    add: (pool, date, place) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'CALL add_concert($1, $2)', [date, place])
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    delete: (pool, id) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'CALL delete_concert($1)', [id])
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    addPupil: (pool, concert_id, pupil_id, dance_id) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'CALL add_pupil_to_concert($1, $2, $3)', [concert_id, pupil_id, dance_id])
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    deletePupil: (pool, concert_id, pupil_id) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'CALL delete_pupil_from_concert($1, $2)', [concert_id, pupil_id])
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    }

}