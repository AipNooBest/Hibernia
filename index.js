const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const app = express();
const port = 3000;
let pools = {};

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

/*
 * TODO:
 *  Подключить Redis вместо pools
 *  Раскидать по разным файлам
 *  Достичь 100% покрытия функций
 *  Переделать авторизацию с cookie на JWT
 */

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/api/v1/login', (req, res) => {
    // Если что, не факт, что у нас в куки лежит *только* токен, это надо будет проверить
    const session = req.header('cookie')?.split('=')[1];
    if (session) return res.status(400).json({ error: 'You are already logged in' });

    const { username, password, remember } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    const pool = new pg.Pool({
        user: username,
        password,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
    });
    pool.connect((err) => {
        if (err?.routine === 'auth_failed') return res.status(401).json({ error: 'Invalid username or password' });
        if (err) return res.status(500).json({ error: 'Error connecting to database' });

        const token = generateSessionToken();
        pools[token] = pool;
        res.cookie('session', token, { maxAge: remember ? 1000 * 60 * 60 * 24 * 7 : null });
        res.status(200).json({ status: 'success', token });
    });
});

app.get('/api/v1/logout', (req, res) => {
    const session = req.header('cookie')?.split('=')[1];
    const pool = pools[session];
    if (!pool || !session) return res.status(401).json({ error: 'Unauthorized' });

    pool.end();
    delete pools[session];
    res.status(200).json({ status: "success", message: "Logged out" });
});

app.get('/api/v1/user/profile', checkSession, (req, res) => {
    const pool = req.pool;
    pool.query('SELECT * FROM view_pupils', (err, result) => {
        if (err) return res.status(500).json({ error: 'Error connecting to database' });
        res.status(200).json(result.rows);
    });
});

app.get('/api/v1/user/unpaid', checkSession, (req, res) => {
    const pool = req.pool;
    pool.query('SELECT * FROM view_unpaid_visits', (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Error connecting to database' });
        }
        res.status(200).json(result.rows);
    });
});

app.get('/api/v1/visits', checkSession, (req, res) => {
    const pool = req.pool;
    let { start_year, start_month , end_year, end_month } = req.query;
    if (!start_year || !start_month)
        return res.status(400).json({ error: 'Start date is required' });
    if (!end_year) end_year = new Date().getFullYear();
    if (!end_month) end_month = new Date().getMonth();
    if (!isValidYear(start_year) || !isValidMonth(start_month) || !isValidYear(end_year) || !isValidMonth(end_month))
        return res.status(400).json({ error: 'Dates must be valid integers' });
    if (start_year > end_year || (start_year === end_year && start_month > end_month))
        return res.status(400).json({ error: 'Start date must be before end date' });

    pool.query('SELECT * FROM get_visits($1, $2, $3, $4)', [start_year, start_month, end_year, end_month], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error connecting to database' });
        }
        res.status(200).json(result.rows);
    });
});

app.get('/api/v1/groups/schedule', checkSession, (req, res) => {
    const pool = req.pool;
    // Вообще, вроде как ученик должен уметь смотреть расписание только своей группы
    // Сейчас же он вообще не может смотреть никакие расписания
    pool.query('SELECT * FROM groups_schedule', (err, result) => {
        if (err) {
            if (err.routine === 'aclcheck_error') return res.status(403).json({ error: 'Forbidden' });
            return res.status(500).json({error: 'Error connecting to database'});
        }
        res.status(200).json(result.rows);
    });
})

app.get('/api/v1/groups', checkSession, (req, res) => {
    const pool = req.pool;
    pool.query('SELECT * FROM get_group_name() AS group_name', (err, result) => {
        if (err) return res.status(500).json({ error: 'Error connecting to database' });
        res.status(200).json(result.rows);
    });
});

app.get('/api/v1/groups/:id', checkSession, (req, res) => {
    const pool = req.pool;
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Group id is required' });
    if (!isUInt(id)) return res.status(400).json({ error: 'Group id must be a valid integer' });
    pool.query('SELECT * FROM get_group_memberships($1)', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error connecting to database' });
        res.status(200).json(result.rows);
    });
});

function generateSessionToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function checkSession(req, res, next) {
    if (process.env.NODE_ENV === 'development') {
        req.pool = new pg.Pool({
            user: process.env.TEST_USER,
            password: process.env.TEST_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
        });
        return next()
    }
    const token = req.headers.cookie.split('=')[1];
    const pool = pools[token];
    if (!pool || !token) return res.status(401).json({ error: 'Unauthorized' });
    req.pool = pool;
    next();
}

function isUInt(value) {
    return /^\d+$/.test(value) && parseInt(value) > 0;
}

function isValidMonth(value) {
    return /^\d+$/.test(value) && parseInt(value) > 0 && parseInt(value) < 13;
}

function isValidYear(value) {
    return /^\d+$/.test(value) && parseInt(value) > 0;
}

function sanitizeString(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '');
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));