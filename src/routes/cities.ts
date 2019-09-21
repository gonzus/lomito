export {};
import express = require('express');
const router = express.Router();

const citiesQueries = require(`../models/cities.js`);

async function getCitiesAll() {
    console.log("Getting all cities");
    const promise = citiesQueries.getAll();
    const [cities] = await Promise.all([promise]);
    console.log("Got cities");
    return cities;
}

async function getCityById(city_id: any) {
    console.log("Getting city by id", city_id);
    const promise = citiesQueries.getById(city_id);
    const [city] = await Promise.all([promise]);
    console.log("Got city by id");
    return city;
}

router.get('/all', (req, res) => {
    (function(){ getCitiesAll().then(data => {
        res.json(data);
    })})();
});

router.get('/by_id', (req, res) => {
    const city_id = req.query.city_id;
    (function(){ getCityById(city_id).then(data => {
        res.json(data);
    })})();
});

module.exports = router;
