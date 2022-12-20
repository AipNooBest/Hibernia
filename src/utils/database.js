// Иногда мне кажется, что я всё усложняю...
const pg = require("pg");
let pools = [];

module.exports = {
    connect: (options) => {
        return new Promise((resolve, reject) => {
            const lifetime = process.env.SESSION_LIFETIME_SEC ?
                process.env.SESSION_LIFETIME_SEC * 1000 : new Date(options.givenDate).getTime() + 1000 * 60 * 60 * 24;
            pools.some((pool) => {
                if (pool.options.user === options.user &&
                    pool.options.password === options.password &&
                    pool.options.host === options.host &&
                    pool.options.port === options.port &&
                    pool.options.database === options.database &&
                    new Date(pool.options.givenDate).getTime() < new Date(Date.now() + lifetime).getDate()) {
                    resolve(pool);
                    return true;
                }
            })
            const pool = new pg.Pool(options);
            pool.connect((err) => {
                if (!err) return resolve(pool);

                if (err.routine === 'auth_failed')
                    return reject({ code: 401, error: 'Invalid username or password' });

                console.log('Connected to database');
            })
        })
    },
    handle: (pool, query, params = []) => {
        return new Promise((resolve, reject) => {
            pool.query(query, params, (err, res) => {
                if (!err) return resolve(res.rows);

                // По-хорошему надо бы проверять по коду ошибки, но так хотя бы более читаемо
                // Мб имеет смысл сделать отдельный класс а-ля Error, который будет принимать код и отдавать сообщение
                if (err.routine === 'aclcheck_error')
                    return reject({ code: 403, error: 'Forbidden' });
                if (err.routine === 'exec_stmt_raise')
                    return reject({ code: 400, error: err.message });

                // Если мы дошли до сюда, значит либо фронт не справился, либо кто-то подделывает запросы
                // Записываем ошибку в консоль, чтобы потом можно было отловить
                console.error(err);
                if (process.env.NODE_ENV === 'development')
                    return reject ({ code: 500, error: err.message, routine: err.routine });
                if (err.routine === '_bt_check_unique')
                    return reject({ code: 409, error: 'Duplicate key' });
                if (err.routine === 'ExecConstraints' || err.routine === 'ParseFuncOrColumn' || err.routine === 'pg_strtoint32')
                    return reject({ code: 400, error: 'Bad Request' });
                return reject({ code: 500, error: 'Error connecting to database' });
            });
        });
    }
}