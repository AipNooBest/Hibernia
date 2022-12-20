const concerts = require('../services/concerts');

module.exports = {
    get: (req, res) => {
        // #swagger.tags = ['Concerts']
        // #swagger.summary = Получение списка концертов
        // #swagger.description = Получение списка всех концертов и их участников. Возвращает массив концертов.
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/Concerts" }}
        concerts.get(req.pool)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    },
    add: (req, res) => {
        // #swagger.tags = ['Concerts']
        // #swagger.summary = Добавление концерта
        /* #swagger.requestBody = {
            description: 'Данные для добавления концерта',
            required: true,
            schema: { $ref: "#/definitions/ConcertAdd" }}
         */
        // #swagger.responses[403] = { schema: { $ref: "#/definitions/Forbidden" }}
        const { date, place } = req.body;
        concerts.add(req.pool, date, place)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    },
    delete: (req, res) => {
        // #swagger.tags = ['Concerts']
        // #swagger.summary = Удаление концерта
        /* #swagger.requestBody = {
            description: 'Данные для удаления концерта',
            required: true,
            schema: { $ref: "#/definitions/ConcertDelete" }}
         */
        // #swagger.responses[403] = { schema: { $ref: "#/definitions/Forbidden" }}
        const { id } = req.body;
        concerts.delete(req.pool, id)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    },
    add_pupil: (req, res) => {
        // #swagger.tags = ['Concerts']
        // #swagger.summary = Добавление участника концерта
        /* #swagger.requestBody = {
            description: 'Данные для добавления участника концерта',
            required: true,
            schema: { $ref: "#/definitions/ConcertAddPupil" }}
         */
        // #swagger.responses[403] = { schema: { $ref: "#/definitions/Forbidden" }}
        const { concert_id, pupil_id, dance_id } = req.body;
        concerts.add_pupil(req.pool, concert_id, pupil_id, dance_id)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    },
    delete_pupil: (req, res) => {
        // #swagger.tags = ['Concerts']
        // #swagger.summary = Удаление участника концерта
        /* #swagger.requestBody = {
            description: 'Данные для удаления участника концерта',
            required: true,
            schema: { $ref: "#/definitions/ConcertDeletePupil" }}
         */
        // #swagger.responses[403] = { schema: { $ref: "#/definitions/Forbidden" }}
        const { concert_id, pupil_id } = req.body;
        concerts.delete_pupil(req.pool, concert_id, pupil_id)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    }
}