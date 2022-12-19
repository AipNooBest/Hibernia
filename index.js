const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes/v1');
const app = express();
const port = 3000;

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Expose-Headers", "Set-Cookie");
    next();
});
app.use('/api/v1', routes);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));