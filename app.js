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

    conn.query('SELECT I.name city, O.name country FROM cities I JOIN countries O ON I.country_id = O.id ORDER BY 1, 2', function (err, rows, fields) {
        if (err) throw err
        let data = rows.map(r => {
            return { city: r.city, country: r.country };
        });
        console.log("cities", data);
        res.json(data);
    });
});

app.get('/countries', (req, res) => {
    console.log("All countries");

    conn.query('SELECT O.name country FROM countries O ORDER BY 1', function (err, rows, fields) {
        if (err) throw err
        let data = rows.map(r => {
            return { country: r.country };
        });
        console.log("countries", data);
        res.json(data);
    });
});

app.get('/cities/:country', (req, res) => {
    const country_id = req.params.country;

    conn.query('SELECT I.name city, O.name country FROM cities I JOIN countries O ON I.country_id = O.id WHERE O.id = ? ORDER BY 1, 2', [ country_id ], function (err, rows, fields) {
        if (err) throw err
        let data = rows.map(r => {
            return { city: r.city, country: r.country };
        });
        console.log("cities for country " + country_id, data);
        res.json(data);
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
