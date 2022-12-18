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
                if (!err) resolve(res.rows);

                if (err.routine === 'aclcheck_error')
                    return reject({ code: 403, error: 'Forbidden' });

                return reject({ code: 500, error: 'Error connecting to database' });
            });
        });
    }
}