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
        if (!token) return res.status(401).json({ code: 401, error: 'Unauthorized' });
        redis.get(token).then(async (options) => {
            if (!options) return res.status(401).json({ code: 401, error: 'Unauthorized' });
            const lifetime = process.env.SESSION_LIFETIME_SEC ?
                process.env.SESSION_LIFETIME_SEC * 1000 : new Date(options.givenDate).getTime() + 1000 * 60 * 60 * 24;
            if (new Date(options.givenDate).getTime() > new Date(Date.now()).getTime() + lifetime) {
                await redis.remove(token);
                return res.status(401).json({code: 401, error: 'Unauthorized'});
            }
            req.pool = new pg.Pool(options);
            req.token = token;
            next();
        }).catch((e) => {
            if (process.env.NODE_ENV === 'development') {
                return res.status(500).json({ code: 500, error: e });
            }
            return res.status(401).json({ code: 500, error: 'Internal Server Error' });
        });
    }
}