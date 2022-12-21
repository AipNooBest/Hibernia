const db = require('../utils/database')
const security = require('../utils/security')

module.exports = {
    getProfile: (pool) => {
        return new Promise(async (resolve, reject) => {
            const isTeacher = await db.handle(pool, 'SELECT pg_has_role(current_user, \'teacher\', \'member\')')
            let query = isTeacher[0] ? 'SELECT * FROM get_teacher(current_user)' : 'SELECT * FROM get_pupil(current_user)'
            db.handle(pool, query)
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
    getByUsername: (pool, username) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'SELECT * FROM get_pupil($1)', [username])
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
    },
    new: (pool, args) => {
        return new Promise((resolve, reject) => {
            // Мда, со статической типизацией было бы гораздо проще проверять -.-'
            args = convertToNewUserArray(args);
            args = security.sanitizeArray(args);
            db.handle(pool, 'CALL add_pupil($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', args)
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    list: (pool) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, 'SELECT * FROM view_pupils')
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    }
}

function convertToNewUserArray(args) {
    return [
        args.last_name,
        args.first_name,
        args.second_name,
        args.age,
        args.sex,
        args.begin_date,
        args.status,
        args.group_id,
        args.username,
        args.password
    ];
}