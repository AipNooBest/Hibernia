const db = require('../../utils/postgres');
const security = require("../../utils/security");

module.exports = {
    get: (pool) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'SELECT * FROM costumes')
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    add: (pool, costume) => {
        costume = security.sanitizeObject(costume);
        return new Promise((resolve, reject) => {
            db.handle(pool, 'CALL add_costume($1, $2, $3, $4)', [costume.type, costume.color, costume.size, costume.cost])
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    delete: (pool, id) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'CALL delete_costume($1)', [id])
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    addPupil: (pool, costume_id, pupil_id, is_owned) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'CALL add_pupil_to_costume($1, $2, $3)', [costume_id, pupil_id, is_owned])
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    deletePupil: (pool, costume_id, pupil_id) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'CALL delete_pupil_from_costume($1, $2)', [costume_id, pupil_id])
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    ownership: (pool) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'SELECT * FROM view_costume_ownership')
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    }
}