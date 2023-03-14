const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.2'});

const outputFile = './docs/v2.json';
const endpointsFiles = ['./src/routes/v2/index.js'];

const doc = {
    info: {
        version: "2.0.0",
        title: "Hibernia API",
        description: "API для работы с системой учёта и управления данными школы ирландских танцев Hibernia"
    },
    host: "localhost:3000",
    basePath: "/api/v2",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        {
            "name": "Auth",
            "description": "Авторизация"
        },
        {
            "name": "Users",
            "description": "Пользователи"
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ],
    definitions: {
        LoginExample: {
            username: "danilov",
            password: "danilov"
        },
        Login: {
            code: 200,
            message: "xo77759j3a8xr694tnuwna",
            role: "pupil"
        },
        LoginFailure: {
            code: 401,
            error: "Invalid username or password"
        },
        LogoutSuccess: {
            code: 200,
            message: "Logged out"
        },
        BadRequest: {
            code: 400,
            error: "Bad request"
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
        UserUnpaid: [{
            full_name: "Иванов Иван Иванович",
            membership: "Абонемент на 1 месяц",
            debt: 1337
        }],
        UserAdd: {
            full_name: "Данилов Денис Олегович",
            membership_id: "641076e3ef13507c4277158a",
            username: "danilov",
            password: "pupil",
            discount: 500
        },
        Visits: [
            {
                "person": "Данилов Денис Олегович",
                "visits": 0,
                "month": 1,
                "year": 2023
            }
        ],
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc)