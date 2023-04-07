const db = require('../../utils/postgres')
const security = require('../../utils/security')

module.exports = {
    get: (pool) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'SELECT * FROM get_group_name() AS group_name')
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    getById: (pool, id) => {
        return new Promise((resolve, reject) => {
            if(!id) return reject({ code: 400, error: 'Bad request' });
            if(!security.isUInt(id)) return reject({ code: 400, error: 'Group id must be a valid integer' });

            db.handle(pool, 'SELECT * FROM get_group_memberships($1)', [id])
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    getSchedule: (pool) => {
        return new Promise((resolve, reject) => {
            // Вообще, вроде как ученик должен уметь смотреть расписание только своей группы
            // Сейчас же он вообще не может смотреть никакие расписания
            db.handle(pool, 'SELECT * FROM groups_schedule')
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    }
}