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

async function getCountriesById(country_id: any) {
    console.log("Getting countries by id", country_id);
    const promise = countriesQueries.getById(country_id);
    const [countries] = await Promise.all([promise]);
    console.log("Got countries by id");
    return countries;
}

router.get('/all', (req, res) => {
    (function(){ getCountriesAll().then(data => {
        res.json(data);
    })})();
});

router.get('/by_id', (req, res) => {
    const country_id = req.query.country_id;
    (function(){ getCountriesById(country_id).then(data => {
        res.json(data);
    })})();
});


module.exports = router;
