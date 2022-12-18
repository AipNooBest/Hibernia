const redis = require('../utils/redis');

module.exports = {
    auth: (req, res, next) => {
        if (process.env.NODE_ENV === 'development') {
            return next();
        }
        // Если что, не факт, что у нас в куки лежит *только* токен, это надо будет проверить
        // Плюс я пока думаю, переходить на JWT или нуегонахер
        const token = req.headers.cookie.split('=')[1];
        const pool = redis.get(token);
        if (!pool || !token) return res.status(401).json({ code: 401, error: 'Unauthorized' });
        req.pool = pool;
        req.token = token;
        next();
    }
}