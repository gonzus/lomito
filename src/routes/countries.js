const express = require('express');
const router = express.Router();

const countriesQueries = require(`../models/countries.js`);

router.get('/all', (req, res) => {
    (async function() {
        const promise = countriesQueries.getAll();
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

router.get('/by_id', (req, res) => {
    const country_id = req.query.country_id || req.query.id;
    if (!/^[0-9]+$/.test(country_id)) {
        res.end();
        return;
    }
    (async function() {
        const promise = countriesQueries.getById(country_id);
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

router.get('/by_name', (req, res) => {
    const country_name = req.query.country_name || req.query.name;
    (async function() {
        const promise = countriesQueries.getByName(country_name);
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

router.get('/like_name', (req, res) => {
    const country_name = req.query.country_name || req.query.name;
    (async function() {
        const promise = countriesQueries.getLikeName(country_name);
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

router.get('/by_iso2', (req, res) => {
    const country_iso2 = req.query.country_iso2 || req.query.iso2;
    (async function() {
        const promise = countriesQueries.getByIso2(country_iso2);
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

router.get('/by_iso3', (req, res) => {
    const country_iso3 = req.query.country_iso3 || req.query.iso3;
    (async function() {
        const promise = countriesQueries.getByIso3(country_iso3);
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

router.get('/by_continent_id', (req, res) => {
    const continent_id = req.query.continent_id || req.query.id;
    if (!/^[0-9]+$/.test(continent_id)) {
        res.end();
        return;
    }
    (async function() {
        const promise = countriesQueries.getByContinentId(continent_id);
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

module.exports = router;
