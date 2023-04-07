const redis = require('../utils/redis');
const { MongoClient } = require('mongodb')

module.exports = {
    auth: (req, res, next) => {
        if (process.env.NODE_ENV === 'development') {
            req.pool = new MongoClient(`mongodb://${process.env.TEST_USER}:${process.env.TEST_PASSWORD}@
                                        ${process.env.DB_HOST}:${process.env.DB_PORT}`)
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
            req.pool = new MongoClient(`mongodb://${options.user}:${options.password}@${options.host}:${options.port}/${options.database}`)
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