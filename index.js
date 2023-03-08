const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes/v1');
const routes_v2 = require('./src/routes/v2');
const redis = require('./src/utils/redis');
const app = express();
const port = 3000;

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
redis.connect(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use('/api/v1', routes);
app.use('/api/v2', routes_v2);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});