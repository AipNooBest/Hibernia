db = db.getSiblingDB('hibernia')

// "Администратор"
db.createUser({
    user: "hibernian_god",
    pwd: "patrick",
    roles: [
        { role: "dbOwner", db: "hibernia" }
    ]
})

// "Менеджер"
db.createUser({
    user: "kalugina",
    pwd: "teacher",
    roles: [
        { role: "teacher", db: "hibernia" }
    ]
})

// "Пользователь"
db.createUser({
    user: "danilov",
    pwd: "pupil",
    roles: [
        { role: "pupil", db: "hibernia" }
    ]
})

db.memberships.insertMany([{
    "_id": ObjectId("641076e3ef13507c4277158a"),
    "name": "Абонемент на 8 занятий",
    "price": Decimal128("4900")
},{
    "_id": ObjectId("64198855eb1d8435f2a946c1"),
    "name": "Абонемент на 1 месяц",
    "price": Decimal128("4400")
},{
    "_id": ObjectId("64198ac7eb1d8435f2a946cd"),
    "name": "Абонемент на 4 занятия",
    "price": Decimal128("3000")
},{
    "_id": ObjectId("64198af1eb1d8435f2a946ce"),
    "name": "Разовое занятие",
    "price": Decimal128("800")
},{
    "_id": ObjectId("64198b32eb1d8435f2a946cf"),
    "name": "Разовое занятие",
    "price": Decimal128("850")
}])

db.groups.insertOne({
    "_id": ObjectId("641988beeb1d8435f2a946c3"),
    "name": "Проспект Вернадского",
    "address": "Проспект Вернадского, 29",
    "memberships": [
        ObjectId("64198855eb1d8435f2a946c1"),
        ObjectId("64198ac7eb1d8435f2a946cd"),
        ObjectId("64198af1eb1d8435f2a946ce")
    ]
})

db.pupils.insertOne({
    "_id": ObjectId("64216c5642a22ee43d073226"),
    "full_name": "Данилов Денис Олегович",
    "referrals": [
        ""
    ],
    "username": "danilov"
})

db.orders.insertOne({
    "_id": ObjectId("6419aeb6eb1d8435f2a946e8"),
    "year": 2023,
    "month": 1,
    "discount": Decimal128("500"),
    "paid": Decimal128("3900"),
    "status": "paid",
    "membership": ObjectId("64198855eb1d8435f2a946c1"),
    "customer": ObjectId("64216c5642a22ee43d073226")
})