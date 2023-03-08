db = getSiblingDB('hibernia')

db.createCollection('visits', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'person', 'year', 'month', 'visits', 'paid', 'discount', 'total', 'membership'],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                person: {
                    bsonType: 'string'
                },
                year: {
                    bsonType: 'int'
                },
                month: {
                    bsonType: 'int'
                },
                visits: {
                    bsonType: 'int'
                },
                paid: {
                    bsonType: 'decimal'
                },
                discount: {
                    bsonType: 'decimal'
                },
                total: {
                    bsonType: 'decimal'
                },
                membership: {
                    bsonType: 'objectId'
                }
            }
        }
    }
})

db.createCollection('memberships', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'name', 'price'],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                name: {
                    bsonType: 'string'
                },
                price: {
                    bsonType: 'decimal'
                }
            }
        }
    }
})
