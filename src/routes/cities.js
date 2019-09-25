const express = require('express');
const router = express.Router();

const citiesQueries = require(`../models/cities.js`);

router.get('/all', (req, res) => {
    (async function(){
        const promise = citiesQueries.getAll();
        const [cities] = await Promise.all([promise]);
        res.json(cities);
    })();
});

router.get('/by_id', (req, res) => {
    const city_id = req.query.city_id || req.query.id;
    if (!/^[0-9]+$/.test(city_id)) {
        res.end();
        return;
    }
    (async function() {
        const promise = citiesQueries.getById(city_id);
        const [cities] = await Promise.all([promise]);
        res.json(cities);
    })();
});

router.get('/by_name', (req, res) => {
    const city_name = req.query.city_name || req.query.name;
    (async function() {
        const promise = citiesQueries.getByName(city_name);
        const [cities] = await Promise.all([promise]);
        res.json(cities);
    })();
});

router.get('/like_name', (req, res) => {
    const city_name = req.query.city_name || req.query.name;
    (async function() {
        const promise = citiesQueries.getLikeName(city_name);
        const [cities] = await Promise.all([promise]);
        res.json(cities);
    })();
});

router.get('/by_region_id', (req, res) => {
    const region_id = req.query.region_id || req.query.id;
    if (!/^[0-9]+$/.test(region_id)) {
        res.end();
        return;
    }
    (async function() {
        const promise = citiesQueries.getByRegionId(region_id);
        const [cities] = await Promise.all([promise]);
        res.json(cities);
    })();
});

router.get('/by_country_id', (req, res) => {
    const country_id = req.query.country_id || req.query.id;
    if (!/^[0-9]+$/.test(country_id)) {
        res.end();
        return;
    }
    (async function() {
        const promise = citiesQueries.getByCountryId(country_id);
        const [cities] = await Promise.all([promise]);
        res.json(cities);
    })();
});

module.exports = router;
