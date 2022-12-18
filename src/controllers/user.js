const user = require('../services/user.js');

module.exports = {
    profile: (req, res) => {
        // #swagger.tags = ['Users']
        // #swagger.summary = Получение профиля через витрину view_pupils из базы данных
        // #swagger.description = Получение профиля ученика, от которого происходит авторизация.
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/UserProfile" }}
        user.getProfile(req.pool, req.user.id)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    },
    unpaid: (req, res) => {
        // #swagger.tags = ['Users']
        // #swagger.summary = Получение списка непогашенных задолженностей
        // #swagger.description = Получение списка непогашенных задолженностей ученика, от которого происходит авторизация.
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/UserUnpaid" }}
        user.getUnpaid(req.pool, req.user.id)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    }
}