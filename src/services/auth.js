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
            db.connect(pool).then((pool) => {
                const token = security.generateSessionToken();
                redis.add(token, pool);
                resolve({ code: 200, token });
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
