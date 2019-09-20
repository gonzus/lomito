const express = require('express');
const router = express.Router();

const conn = require('../db.js');

router.use(function timeLog (req, res, next) {
  console.log('Countries Time: ', Date.now())
  next()
});


router.get('/', (req, res) => {
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

module.exports = router;
