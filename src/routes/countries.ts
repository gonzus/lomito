export {};
import express = require('express');
const router = express.Router();

const countriesQueries = require(`../models/countries.js`);

async function getCountriesAll() {
    console.log("Getting all countries");
    const promise = countriesQueries.getAll();
    const [countries] = await Promise.all([promise]);
    console.log("Got countries");
    return countries;
}

async function getCountryById(country_id: any) {
    console.log("Getting country by id", country_id);
    const promise = countriesQueries.getById(country_id);
    const [countries] = await Promise.all([promise]);
    console.log("Got country by id");
    return countries;
}

router.get('/all', (req, res) => {
    (async function() {
        const data = await getCountriesAll();
        res.json(data);
    })();
});

router.get('/by_id', (req, res) => {
    const country_id = req.query.country_id;
    if (!/^[0-9]+$/.test(country_id)) {
        res.end();
        return;
    }
    (async function() {
        const data = await getCountryById(country_id);
        res.json(data);
    })();
});


module.exports = router;
