const costumes = require('../../services/postgres/costumes');

module.exports = {
    get: (req, res) => {
        // #swagger.tags = ['Costumes']
        // #swagger.summary = Получение списка костюмов
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/Costumes" }}
        costumes.get(req.pool)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    },
    add: (req, res) => {
        // #swagger.tags = ['Costumes']
        // #swagger.summary = Добавление костюма
        /* #swagger.requestBody = {
            description: 'Данные костюма',
            required: true,
            schema: { $ref: "#/definitions/CostumeAdd" }}
         */
        // #swagger.responses[400] = { schema: { $ref: "#/definitions/BadRequest" }}
        // #swagger.responses[403] = { schema: { $ref: "#/definitions/Forbidden" }}
        costumes.add(req.pool, req.body)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    },
    delete: (req, res) => {
        // #swagger.tags = ['Costumes']
        // #swagger.summary = Удаление костюма
        // #swagger.responses[400] = { schema: { $ref: "#/definitions/BadRequest" }}
        // #swagger.responses[403] = { schema: { $ref: "#/definitions/Forbidden" }}
        costumes.delete(req.pool, req.params.id)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    },
    addPupil: (req, res) => {
        // #swagger.tags = ['Costumes']
        // #swagger.summary = Выдача костюма ученику
        /* #swagger.requestBody = {
            description: '',
            required: true,
            schema: { $ref: "#/definitions/CostumeAddPupil" }}
         */
        // #swagger.responses[400] = { schema: { $ref: "#/definitions/BadRequest" }}
        // #swagger.responses[403] = { schema: { $ref: "#/definitions/Forbidden" }}
        const { costume_id, pupil_id, is_owned } = req.body;
        costumes.addPupil(req.pool, costume_id, pupil_id, is_owned)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    },
    deletePupil: (req, res) => {
        // #swagger.tags = ['Costumes']
        // #swagger.summary = Удаление костюма из списка у ученика
        /* #swagger.requestBody = {
            description: 'Данные ученика',
            required: true,
            schema: { $ref: "#/definitions/CostumeDeletePupil" }}
         */
        // #swagger.responses[400] = { schema: { $ref: "#/definitions/BadRequest" }}
        // #swagger.responses[403] = { schema: { $ref: "#/definitions/Forbidden" }}
        costumes.deletePupil(req.pool, req.body)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    },
    ownership: (req, res) => {
        // #swagger.tags = ['Costumes']
        // #swagger.summary = Получение списка костюмов, которые принадлежат ученику, либо список всех учеников с костюмами
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/CostumeOwnership" }}
        costumes.ownership(req.pool, req.params.id)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    }
}