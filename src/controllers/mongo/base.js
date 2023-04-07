const base = require('../../services/mongo/base');

module.exports = {
    visits: (req, res) => {
        // #swagger.summary = Получение списка посещений
        // #swagger.description = Получение списка посещений за определённый период времени. Возвращает дату, имя ученика, количество посещений, название группы, уплаченную сумму, скидку и тип абонемента.
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/Visits" }}
        let start_year = req.query.start_year;
        let start_month = req.query.start_month;
        let end_year = req.query.end_year;
        let end_month = req.query.end_month;
        base.visits(req.pool, start_year, start_month, end_year, end_month)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    }
}