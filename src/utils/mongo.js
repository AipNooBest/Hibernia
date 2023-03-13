// Урррра, дубликаты
const { MongoClient } = require('mongodb')
let pools = [];

module.exports = {
    connect: (options) => {
        return new Promise((resolve, reject) => {
            pools.some((pool) => {
                if (poolExists(pool, options)) {
                    resolve(pool);
                    return true;
                }
            });
            const pool = new MongoClient(`mongodb://${options.user}:${options.password}@${options.host}:${options.port}`);
            pool.db(options.database).command({ ping: 1 })
                .then((_) => resolve(pool))
                .catch((err) => {
                console.error(err);
                if (err.codeName === 'AuthenticationFailed')
                    reject({ code: 401, error: 'Unauthorized' });
                if (process.env.NODE_ENV === 'development')
                    return reject ({ code: 500, error: err.message, routine: err.codeName });
                reject({ code: 500, error: 'Internal Server Error' });
            })
        })
    },
    // https://www.mongodb.com/docs/v5.0/reference/command
    handle: (pool, query) => {
        return new Promise((resolve, reject) => {
            pool.db(process.env.MONGO_DB).command(query)
                .then(doc => resolve(doc))
                .catch(err => {
                    console.error(err)
                    reject({ code: 500, error: err.message })
                })
        });
    },
    close: (pool) => {
        return new Promise((resolve, reject) => {
            pool.close()
                .then(() => resolve())
                .catch(err => {
                    console.error(err)
                    reject({ code: 500, error: err.message })
                })
        });
    },
    // TODO: допилить конкретно эту часть: исправить ошибку с транзакциями
    transaction: (pool, queries) => {
        return new Promise(async (resolve, reject) => {
            const session = pool.startSession()
            try {
                await session.withTransaction(() => {
                    const promises = [];
                    queries.forEach(query => {
                        promises.push(pool.db(process.env.MONGO_DB).command(query));
                    });
                    Promise.all(promises)
                        .then(() => {
                            resolve()
                        })
                        .catch(err => {
                            console.error(err)
                            reject({code: 500, error: err.message})
                        })
                })
            } catch (e) {
                console.error(e)
                reject({code: 500, error: e.message})
            } finally {
                await session.endSession()
            }
        });
    }
}

function poolExists(pool, options) {
    const lifetime = process.env.SESSION_LIFETIME_SEC ?
        process.env.SESSION_LIFETIME_SEC * 1000 : new Date(options.givenDate).getTime() + 1000 * 60 * 60 * 24;
    return pool.options.user === options.user &&
        pool.options.password === options.password &&
        pool.options.host === options.host &&
        pool.options.port === options.port &&
        pool.options.database === options.database &&
        new Date(pool.options.givenDate).getTime() < new Date(Date.now() + lifetime).getDate();
}