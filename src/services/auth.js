const pg = require('pg');
const security = require('../utils/security');
const db = require('../utils/database');
const redis = require('../utils/redis');

module.exports = {
    login: (username, password) => {
        return new Promise((resolve, reject) => {
            const pool = new pg.Pool({
                user: username,
                password,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                database: process.env.DB_NAME,
            });
            db.connect(pool).then(async (pool) => {
                const token = security.generateSessionToken();
                redis.add(token, pool);
                const roles = await db.handle(pool, 'SELECT rolname FROM pg_roles WHERE pg_has_role($1, oid, \'member\');', [username]);
                resolve({ code: 200, message: token, role: roles[0].rolname });
            }).catch((e) => {
                reject(e);
            });
        });
    },
    logout: (token) => {
        return new Promise((resolve, reject) => {
            if (!token || !redis.get(token)) return reject({ code: 401, error: 'Unauthorized' });
            redis.remove(token);
            resolve({ code: 200, message: "Logged out" });
        });
    }
}
