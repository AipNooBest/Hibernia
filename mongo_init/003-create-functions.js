db.getSiblingDB("hibernia")

db.system.js.insertOne(
    {
        _id: "addOrder",
        value: function(customer_id, membership_id) {
            db.orders.insertOne({
                "year": Date.now().year,
                "month": Date.now().month,
                "discount": { "$numberDecimal": "500" },
                "paid": { "$numberDecimal": "0" },
                "status": "init",
                "membership": { "$oid": membership_id },
                "customer": { "$oid": customer_id }
            });
        }
    }
)

// Эта штука почему-то не работает, вызывает зависание
// Да и в принципе в монге это едва ли задокументировано
// Плюс там настоятельно не рекомендуют делать логику на стороне БД
// db.runCommand(
//     {
//         eval: function() {
//             return addOrder(customer_id, membership_id);
//         }
//     }
// )