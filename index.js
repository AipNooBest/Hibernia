const express = require('express');
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
 */


// Вообще, всё пока лежит в куче, потому что я это писал на скорую руку на рабочем месте
// Я этот код даже не запускал, так что не удивляйтесь, если он не работает
// Позже я разнесу всё по разным файлам и сделаю нормальную структуру
// Удачи поднять всё это дело хоть как-то :^)

app.post('/api/v1/login', (req, res) => {
    const { username, password } = req.body;
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
        if (err) return res.status(500).send('Error connecting to database');

        const token = generateSessionToken();
        pools[token] = pool;
        res.setHeader('Set-Cookie', `session=${token}`);
        res.status(200).send('Logged in');
    });
});

app.get('/api/v1/logout', (req, res) => {
    const token = req.cookies.session;
    if (!token) return res.status(400).send('No session token found');

    const pool = pools[token];
    if (!pool) return res.status(400).json({error: 'No session token found'});

    pool.end();
    delete pools[token];
    res.status(200).send('Logged out');
});

app.get('/api/v1/user/profile', checkSession, (req, res) => {
    const pool = req.pool;
    pool.query('SELECT * FROM view_pupils', (err, result) => {
        if (err) return res.status(500).send('Error querying database');
        res.status(200).json(result.rows);
    });
});

app.get('/api/v1/user/unpaid', checkSession, (req, res) => {
    const pool = req.pool;
    pool.query('SELECT * FROM view_unpaid_visits', (err, result) => {
        if (err) return res.status(500).send('Error querying database');
        res.status(200).json(result.rows);
    });
});

app.get('/api/v1/user/visits', checkSession, (req, res) => {
    const pool = req.pool;
    pool.query('SELECT * FROM get_visits()', (err, result) => {
        if (err) return res.status(500).send('Error querying database');
        res.status(200).json(result.rows);
    });
});

app.get('/api/v1/groups/schedule', checkSession, (req, res) => {
    const pool = req.pool;
    pool.query('SELECT * FROM groups_schedule', (err, result) => {
        if (err) return res.status(500).send('Error querying database');
        res.status(200).json(result.rows);
    });
})

app.get('/api/v1/groups', checkSession, (req, res) => {
    const pool = req.pool;
    pool.query('SELECT * FROM get_group_name()', (err, result) => {
        if (err) return res.status(500).send('Error querying database');
        res.status(200).json(result.rows);
    });
});

app.get('/api/v1/groups/:id', checkSession, (req, res) => {
    const pool = req.pool;
    const { id } = req.params;
    pool.query('SELECT * FROM get_group($1)', [id], (err, result) => {
        if (err) return res.status(500).send('Error querying database');
        res.status(200).json(result.rows);
    });
});

function generateSessionToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function checkSession(req, res, next) {
    const token = req.cookies.session;
    if (!token) return res.status(400).send('No session token found');

    const pool = pools[token];
    if (!pool) return res.status(400).send('No session token found');
    req.pool = pool;
    next();
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));