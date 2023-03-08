const groups = require('../../services/postgres/groups');

module.exports = {
    get: (req, res) => {
        // #swagger.tags = ['Groups']
        // #swagger.summary = Получение названий групп ученика
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/GroupsGet" }}
        groups.get(req.pool)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    },
    getById: (req, res) => {
        // #swagger.tags = ['Groups']
        // #swagger.summary = Получение информации об абонементах, доступных данной группе
        // #swagger.description = Возвращает список доступных абонементов, их цену и ID.
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/GroupById" }}
        groups.getById(req.pool, req.params.id)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    },
    schedule: (req, res) => {
        // #swagger.tags = ['Groups']
        // #swagger.summary = Получение расписания группы
        // #swagger.description = Получение расписания группы, в которой состоит данный ученик, либо которые ведёт учитель.
        // Возвращает день недели, время начала, продолжительность занятия, название зала, название группы и адрес.
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/Schedule" }}
        groups.getSchedule(req.pool)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    }

}