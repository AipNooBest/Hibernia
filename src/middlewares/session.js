const redis = require('../utils/redis');
const pg = require("pg");

module.exports = {
    auth: (req, res, next) => {
        if (process.env.NODE_ENV === 'development') {
            req.pool = new pg.Pool({
                user: process.env.TEST_USER,
                password: process.env.TEST_PASSWORD,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                database: process.env.DB_NAME,
            });
            return next();
        }
        // В жопу эти ваши куки, лучше через Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        const pool = redis.get(token);
        if (!pool || !token) return res.status(401).json({ code: 401, error: 'Unauthorized' });
        req.pool = pool;
        req.token = token;
        next();
    }
}