const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.2'});

const outputFile = './docs/swagger_output.json';
const endpointsFiles = ['./src/routes/v1/index.js'];

const doc = {
    info: {
        version: "1.0.0",
        title: "Hibernia API",
        description: "API для работы с системой учёта и управления данными школы ирландских танцев Hibernia"
    },
    host: "localhost:" + process.env.API_PORT ? process.env.API_PORT : "3000",
    basePath: "/api/v1",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        {
            name: "Auth",
            description: "Авторизация и регистрация"
        },
        {
            name: "Users",
            description: "Работа с пользователями"
        },
        {
            name: "Groups",
            description: "Работа с группами"
        }
    ],
    securityDefinitions: {
        cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "session"
        }
    },
    security: [
        {
            cookieAuth: []
        },
    ],
    definitions: {
        LoginExample: {
            username: "admin",
            password: "admin"
        },
        Login: {
            code: 200,
            message: "xo77759j3a8xr694tnuwna"
        },
        LoginFailure: {
            code: 401,
            error: "Invalid username or password"
        },
        LogoutSuccess: {
            code: 200,
            message: "Logged out"
        },
        Unauthorized: {
            code: 401,
            message: "Unauthorized"
        },
        Forbidden: {
            code: 403,
            message: "Forbidden"
        },
        InternalServerError: {
            code: 500,
            message: "Internal server error"
        },
        UserProfile: [{
            full_name: "Иванов Иван Иванович",
            age: 20,
            sex: "Мужской",
            status: "Постоянно посещает занятия",
            group_name: "Проспект Вернадского"
        }],
        UserUnpaid: [{
            full_name: "Иванов Иван Иванович",
            membership: "Абонемент на 1 месяц",
            debt: 1337
        }],
        Visits: [
            { date: "Январь 2022", pupil_name: "Рыбаков Даниил Максимович", visits: 1, group_name: "Проспект Вернадского", paid: 4400, discount: 0, membership: "Абонемент на 1 месяц" },
            { date: "Февраль 2022", pupil_name: "Данилов Денис Олегович", visits: 6, group_name: "Проспект Вернадского", paid: 3900, discount: 500, membership: "Абонемент на 1 месяц" },
            { date: "Февраль 2022", pupil_name: "Рыбаков Даниил Максимович", visits: 2, group_name: "Проспект Вернадского", paid: 4400, discount: 0, membership: "Абонемент на 1 месяц" } ],
        GroupsGet: [{ group_name: "Проспект Вернадского" }],
        GroupById: [
            { id: 1, name: "Абонемент на 1 месяц", price: 4400, group_id: 1 },
            { id: 5, name: "Абонемент на 4 занятия", price: 3000, group_id: 1 },
            { id: 9, name: "Разовое занятие", price: 850, group_id: 1 } ],
        Schedule: [
            { weekday: "Среда", begin_time: "19:00", duration: "02:00:00", hall: "Ромашка", group_name: "Проспект Вернадского", address: "Проспект Вернадского, д. 29" },
            { weekday: "Суббота", begin_time: "11:00", duration: "01:00:00", hall: "3", group_name: "Новые Черемушки", address: "Ул. Профсоюзная, 31к5" }
        ]

    }
}

swaggerAutogen(outputFile, endpointsFiles, doc)