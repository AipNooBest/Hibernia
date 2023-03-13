const user = require('../../services/mongo/user.js');

module.exports = {
    unpaid: (req, res) => {
        // #swagger.tags = ['Users']
        // #swagger.summary = Получение списка непогашенных задолженностей
        // #swagger.description = Получение списка непогашенных задолженностей ученика, от которого происходит авторизация.
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/UserUnpaid" }}
        user.getUnpaid(req.pool)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    },

}