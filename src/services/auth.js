const security = require('../utils/security');
const db = require('../utils/database');
const redis = require('../utils/redis');

module.exports = {
    login: (username, password) => {
        return new Promise((resolve, reject) => {
            const options = {
                user: username,
                password,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                database: process.env.DB_NAME,
                givenDate: new Date(Date.now()).toISOString(),
            }
            db.connect(options).then(async (pool) => {
                const token = security.generateSessionToken();
                await redis.add(token, options);
                const roles = await db.handle(pool, 'SELECT rolname FROM pg_roles WHERE pg_has_role($1, oid, \'member\');', [username]);
                resolve({ code: 200, message: token, role: roles[0].rolname });
            }).catch((e) => {
                reject(e);
            });
        });
    },
    logout: (token) => {
        return new Promise(async (resolve, reject) => {
            if (!token || !await redis.get(token)) return reject({ code: 401, error: 'Unauthorized' });
            await redis.remove(token);
            resolve({ code: 200, message: "Logged out" });
        });
    }
}
