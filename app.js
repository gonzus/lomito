const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const myLogger = function (req, res, next) {
    console.log(`=== ${ req.method } ===`);
    console.log("hostname", req.hostname);
    console.log("originalUrl", req.originalUrl);
    console.log("params", req.params);
    console.log("headers", req.headers);
    console.log("cookies", req.cookies);
    console.log(`--- ${ req.method } ---`);

    next();
}

app.use(myLogger)

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'gonzo',
  password: 'gonzo',
  database: 'trips'
});
conn.connect();

app.get('/', (req, res) => {
    const data = {
        id: 11,
        places: ['Amsterdam', 'London'],
    };
    res.json(data);
});

app.get('/cities', (req, res) => {
    console.log("All cities");

    conn.query('SELECT * FROM cities ORDER BY name', function (err, rows, fields) {
        if (err) throw err
        let data = rows.map(r => r.name);
        console.log("cities", data);
        res.json(data);
    });
});

app.get('/cities/:country', (req, res) => {
    const country_id = req.params.country;
    console.log("Cities for country " + country_id);

    conn.query('SELECT I.name city, O.name country FROM cities I JOIN countries O ON I.country_id = O.id WHERE O.id = ? ORDER BY 1', [ country_id ], function (err, rows, fields) {
        if (err) throw err
        let data = rows.map(r => r.city);
        console.log("cities", data);
        res.json(data);
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
