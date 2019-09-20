const express = require('express');
const router = express.Router();

const pool = require('../db.js');

router.use(function timeLog (req, res, next) {
  console.log('Cities Time: ', Date.now())
  next()
});

async function queryCities() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying cities");
        const rows = await conn.query("SELECT I.name city, O.name country FROM cities I JOIN countries O ON I.country_id = O.id ORDER BY 1, 2");
        const data = rows.map(r => {
            return { city: r.city };
        });
        console.log("Queried cities", data);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function queryCountries() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying countries");
        const rows = await conn.query("SELECT O.name country FROM countries O ORDER BY 1");
        const data = rows.map(r => {
            return { country: r.country };
        });
        console.log("Queried countries", data);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getData() {
    console.log("Getting cities AND countries");
    const qi = queryCities();
    const qo = queryCountries();
    let [cities, countries] = await Promise.all([qi, qo]);
    console.log("Got cities AND countries");
    return { cities: cities, countries: countries };
}

router.get('/', (req, res) => {
    console.log("Calling for data");
    const getter = function(){ getData().then(data => {
        console.log("Called for data", data);
        console.log("Returning JSON");
        res.json(data);
    })};
    getter();
});

module.exports = router;
