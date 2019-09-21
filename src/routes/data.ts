export {};
import express = require('express');
const router = express.Router();

const peopleQueries = require(`../models/people.js`);
const citiesQueries = require(`../models/cities.js`);
const countriesQueries = require(`../models/countries.js`);

async function getDataAll() {
    console.log("Getting all data");
    const promises = [
        peopleQueries.getAll(),
        citiesQueries.getAll(),
        countriesQueries.getAll(),
    ];
    const [people, cities, countries] = await Promise.all(promises);
    console.log("Got data");
    return { people, cities, countries };
}

router.get('/all', (req, res) => {
    (function(){ getDataAll().then(data => {
        res.json(data);
    })})();
});

module.exports = router;
