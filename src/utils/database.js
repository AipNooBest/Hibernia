// Иногда мне кажется, что я всё усложняю...

module.exports = {
    connect: (pool) => {
        return new Promise((resolve, reject) => {
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

                console.error(err);
                return reject({ code: 500, error: 'Error connecting to database' });
            });
        });
    }
}