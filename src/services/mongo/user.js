const db = require('../../utils/mongo');
const {ObjectId} = require("mongodb");

module.exports = {
    getUnpaid: (pool) => {
        return new Promise((resolve, reject) => {
            db.handle(pool, {
                find: 'visits',
                filter: {
                    $expr: { $ne: [ "$paid", "$total" ] }
                }
            })
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    new: (pool, args) => {
        return new Promise(async (resolve, reject) => {
            let userArr = convertToNewUserArray(args)
            let price = await db.handle(pool, {
                find: "memberships",
                filter: {
                    _id: new ObjectId(userArr[1])
                }
            });

            if (!price) {
                return reject('Membership not found');
            }

            price = price.cursor.firstBatch[0].price;
            db.transaction(pool, [
                {
                    createUser: userArr[2],
                    pwd: userArr[3],
                    roles: [
                        { role: "student", db: "hibernia" }
                    ]
                },
                {
                    insert: 'visits',
                    document: {
                        person: userArr[0],
                        membership: userArr[1],
                        visits: 0,
                        paid: 0,
                        discount: userArr[4],
                        total: price - userArr[4],
                    }
                }
            ])
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    }
}

function convertToNewUserArray(args) {
    return [
        args.full_name,
        args.membership_id,
        args.username,
        args.password,
        args.discount
    ];
}