const db = require('../../utils/mongo');

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
}

