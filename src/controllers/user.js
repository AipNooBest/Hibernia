const user = require('../services/user.js');

module.exports = {
    profile: (req, res) => {
        // #swagger.tags = ['Users']
        // #swagger.summary = Получение профиля через витрину view_pupils из базы данных
        // #swagger.description = Получение профиля ученика, от которого происходит авторизация.
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/UserProfile" }}
        user.getProfile(req.pool)
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
    },
    getByUsername: (req, res) => {
        // #swagger.tags = ['Users']
        // #swagger.summary = Получение профиля по имени пользователя
        // #swagger.description = Получение профиля ученика по его имени пользователя.
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/UserGetByUsername" }}
        user.getByUsername(req.pool, req.params.username)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    },
    delete: (req, res) => {
        // #swagger.tags = ['Users']
        // #swagger.summary = Удаление ученика
        // #swagger.description = Удаление ученика из базы данных по его логину.
        // #swagger.parameters['username'] = { description: 'Логин ученика' }
        // #swagger.responses[403] = { schema: { $ref: "#/definitions/Forbidden" }}
        let username = req.params.username;
        if (!username) {
            res.status(400).json({
                code: 400,
                message: 'Bad request'
            });
        }
        user.delete(req.pool, username)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    },
    new: (req, res) => {
        // #swagger.tags = ['Users']
        // #swagger.summary = Добавление ученика
        // #swagger.description = Добавление ученика в базу данных.
        // #swagger.requestBody = { schema: { $ref: "#/definitions/UserAdd" }}
        // #swagger.responses[403] = { schema: { $ref: "#/definitions/Forbidden" }}
        // Для swagger:
        // noinspection ES6ShorthandObjectProperty
        // noinspection JSUnusedLocalSymbols
        const { last_name, first_name, second_name, age, sex, begin_date, status, group_id, username, password } = req.body;

        let args = req.body;
        // Check length of Object
        if (Object.keys(args).length !== 10) {
            res.status(400).json({
                code: 400,
                message: 'Bad request'
            });
        }
        user.new(req.pool, args)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    },
    list: (req, res) => {
        // #swagger.tags = ['Users']
        // #swagger.summary = Получение списка учеников
        // #swagger.description = Получение списка учеников из базы данных.
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/UserList" }}
        user.list(req.pool)
            .then(r => res.status(200).json(r))
            .catch(e => {
                console.log(e);
                res.status(e.code).json(e);
            });
    }
}