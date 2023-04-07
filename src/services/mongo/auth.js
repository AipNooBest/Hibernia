const security = require('../../utils/security');
const db = require('../../utils/mongo');
const redis = require('../../utils/redis');

module.exports = {
    login: (username, password) => {
        return new Promise((resolve, reject) => {
            const options = {
                user: username,
                password,
                host: process.env.MONGO_HOST,
                port: process.env.MONGO_PORT,
                database: process.env.MONGO_DB,
                givenDate: new Date(Date.now()).toISOString(),
            }
            db.connect(options).then(async (pool) => {
                const info = await db.handle(pool, { usersInfo: { user: options.user, db: options.database } });
                if (info.users.length === 0) return reject({ code: 401, error: 'Unauthorized' });
                const token = security.generateSessionToken();
                await redis.add(token, options);
                // Надо ещё внести проверку поля db, но сейчас на это нет времени
                resolve({ code: 200, message: token, role: info.users[0].roles[0].role });
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
