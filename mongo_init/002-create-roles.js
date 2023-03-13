db = db.getSiblingDB('hibernia')

db.createRole( {
    role: "teacher",
    privileges: [
        { resource: { db: "hibernia", collection: "" }, actions: [ "find", "insert", "update", "remove" ] },
        { resource: { db: "hibernia", collection: "visits" }, actions: [ "find", "insert", "update", "remove" ] },
        { resource: { db: "hibernia", collection: "memberships" }, actions: [ "find", "insert", "update", "remove" ] }
    ],
    roles: []
})

db.createRole( {
    role: "student",
    privileges: [
        { resource: { db: "hibernia", collection: "" }, actions: [ "find" ] }
    ],
    roles: []
})
