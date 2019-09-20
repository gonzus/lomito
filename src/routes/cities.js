const express = require('express');
const router = express.Router();

const conn = require('../db.js');

router.use(function timeLog (req, res, next) {
  console.log('Cities Time: ', Date.now())
  next()
});

router.get('/', (req, res) => {
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

router.get('/:country', (req, res) => {
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

module.exports = router;
