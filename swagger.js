const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.2'});

const outputFile = './docs/swagger_output.json';
const endpointsFiles = ['./src/routes/v1/index.js'];

const doc = {
    info: {
        version: "1.0.0",
        title: "Hibernia API",
        description: "API для работы с системой учёта и управления данными школы ирландских танцев Hibernia"
    },
    host: "localhost:3000",
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
        },
        {
            name: "Concerts",
            description: "Работа с концертами"
        },
        {
            name: "Costumes",
            description: "Работа с костюмами"
        }
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
        Conflict: {
            code: 409,
            message: "Duplicate key"
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
        UserGetByUsername: [{
            "full_name": "Данилов Денис Олегович",
            "age": 20,
            "sex": "Мужской",
            "status": "Постоянно посещает занятия",
            "group_name": "Проспект Вернадского",
            "membership": "Абонемент на 1 месяц"
        }],
        UserAdd: {
            last_name: "Данилов",
            first_name: "Денис",
            second_name: "Олегович",
            age: 20,
            sex: 0,
            begin_date: "2022-10-27",
            status: 1,
            group_id: 1,
            username: "danilov",
            password: "epic"
        },
        UserAddV2: {
            full_name: "Данилов Денис Олегович",
            membership_id: "641076e3ef13507c4277158a",
            username: "danilov",
            password: "pupil",
            discount: 500
        },
        UserList: [
            {
                "full_name": "Яковлева Таисия Геннадьевна",
                "age": 26,
                "sex": "Женский",
                "status": "Постоянно посещает занятия",
                "group_name": "Новые Черемушки",
                "username": "yakovleva"
            },
            {
                "full_name": "Власова Ангелина Матвеевна",
                "age": 9,
                "sex": "Женский",
                "status": "Заморожен",
                "group_name": "Проспект Вернадского",
                "username": "vlasovaa"
            },
        ],
        Concerts: [
            {
                "id": 1,
                "beginning_time": "2021-07-14T15:00:00.000Z",
                "address": "Сибирский пр-д, 2, стр. 5",
                "dance_name": "Beginner's Reel Hard",
                "dance_duration": "00:01:06",
                "pupil_name": "Данилов Денис Олегович",
                "dance_type": "Жёсткий"
            },
            {
                "id": 2,
                "beginning_time": "2022-07-29T16:00:00.000Z",
                "address": "Тверская улица, дом 13",
                "dance_name": "Mix Reel Soft",
                "dance_duration": "00:01:17",
                "pupil_name": "Данилов Денис Олегович",
                "dance_type": "Мягкий"
            }
        ],
        ConcertAdd: {
            date: "2022-10-27",
            place: "Тверская улица, дом 13"
        },
        ConcertDelete: {
            id: "1"
        },
        ConcertAddPupil: {
            concert_id: 1,
            pupil_id: 1,
            dance_id: 1
        },
        ConcertDeletePupil: {
            concert_id: 1,
            pupil_id: 1
        },
        Costumes: [
            {
                "id": 1,
                "type": "Платье",
                "color": "Оранжевый",
                "clothes_size": 0,
                "cost": "$5,000.00"
            },
            {
                "id": 2,
                "type": "Платье",
                "color": "Черно-желтый",
                "clothes_size": 0,
                "cost": "$5,000.00"
            }
        ],
        CostumeAdd: {
            type: "Платье",
            color: "Красный",
            size: "42",
            cost: 1800
        },
        CostumeAddPupil: {
            pupil_id: 1,
            costume_id: 1,
            is_owned: true
        },
        CostumeDeletePupil: {
            pupil_id: 1,
            costume_id: 1
        },
        CostumeOwnership: [
            {
                "pupil_name": "Рыбаков Даниил Максимович",
                "costume_type": "Рубашка",
                "costume_color": "Синий",
                "costume_size": 0,
                "costume_cost": "$2,500.00",
                "costume_own": true
            }
        ],
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