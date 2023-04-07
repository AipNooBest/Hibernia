const auth = require('../../services/postgres/auth');

module.exports = {
    login: (req, res) => {
        // #swagger.tags = ['Auth']
        // #swagger.summary = Авторизация
        // #swagger.description = Авторизация в системе. Устанавливает в куки токен доступа в виде переменной `session` и возвращает его в теле ответа.
        /* #swagger.requestBody = {
            description: 'Данные для авторизации',
            required: true,
            schema: { $ref: "#/definitions/LoginExample" }}
         */
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/Login" }}
        // #swagger.responses[401] = { schema: { $ref: "#/definitions/LoginFailure" }}
        const { username, password } = req.body;
        auth.login(username, password)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    },
    logout: (req, res) => {
        // #swagger.tags = ['Auth']
        // #swagger.summary = Выход из системы
        // #swagger.description = Выход из системы. Удаляет из куки токен доступа.
        // #swagger.responses[200] = { schema: { $ref: "#/definitions/LogoutSuccess" }}
        auth.logout(req.token)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    }
}