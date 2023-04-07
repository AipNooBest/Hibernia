db = db.getSiblingDB('hibernia')

db.createCollection('orders', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'customer', 'year', 'month', 'paid', 'discount', 'status', 'membership'],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                customer: {
                    bsonType: 'objectId'
                },
                year: {
                    bsonType: 'int'
                },
                month: {
                    bsonType: 'int',
                    minimum: 1,
                    maximum: 12
                },
                paid: {
                    bsonType: 'decimal'
                },
                discount: {
                    bsonType: 'decimal'
                },
                status: {
                    bsonType: 'string'
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

db.createCollection('groups', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'name', 'address', 'memberships'],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                name: {
                    bsonType: 'string'
                },
                address: {
                    bsonType: 'string'
                },
                memberships: {
                    bsonType: 'array',
                    minItems: 1,
                    items: {
                        bsonType: 'string'
                    }
                }
            }
        }
    }
})

db.createCollection('pupils', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['full_name', 'referrals', 'username'],
            properties: {
                full_name: {
                    bsonType: 'string'
                },
                referrals: {
                    bsonType: 'array',
                    items: {
                        bsonType: 'objectId'
                    }
                },
                username: {
                    bsonType: 'string'
                }
            }
        }
    }
})
