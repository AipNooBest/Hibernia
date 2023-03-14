db = db.getSiblingDB('hibernia')

db.createUser({
    user: "kalugina",
    pwd: "teacher",
    roles: [
        { role: "teacher", db: "hibernia" }
    ]
})

db.createUser({
    user: "danilov",
    pwd: "pupil",
    roles: [
        { role: "pupil", db: "hibernia" }
    ]
})

db.memberships.insertOne({
    "_id": ObjectId("641076e3ef13507c4277158a"),
    "name": "Абонемент на 8 занятий",
    "price": Decimal128("4400")
})

db.visits.insertOne({
    "person": "Данилов Денис Олегович",
    "year": 2023,
    "month": 1,
    "visits": 0,
    "paid": Decimal128("3900"),
    "discount": Decimal128("500"),
    "total": Decimal128("3900"),
    "membership": ObjectId("641076e3ef13507c4277158a")
})