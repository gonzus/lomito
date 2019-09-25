const express = require('express');
const router = express.Router();

const regionsQueries = require(`../models/regions.js`);

router.get('/all', (req, res) => {
    (async function() {
        const promise = regionsQueries.getAll();
        const [regions] = await Promise.all([promise]);
        res.json(regions);
    })();
});

router.get('/by_id', (req, res) => {
    const region_id = req.query.region_id || req.query.id;
    if (!/^[0-9]+$/.test(region_id)) {
        res.end();
        return;
    }
    (async function() {
        const promise = regionsQueries.getById(region_id);
        const [regions] = await Promise.all([promise]);
        res.json(regions);
    })();
});

router.get('/by_name', (req, res) => {
    const region_name = req.query.region_name || req.query.name;
    (async function() {
        const promise = regionsQueries.getByName(region_name);
        const [regions] = await Promise.all([promise]);
        res.json(regions);
    })();
});

router.get('/like_name', (req, res) => {
    const region_name = req.query.region_name || req.query.name;
    (async function() {
        const promise = regionsQueries.getLikeName(region_name);
        const [regions] = await Promise.all([promise]);
        res.json(regions);
    })();
});

router.get('/by_country_id', (req, res) => {
    const country_id = req.query.country_id || req.query.id;
    if (!/^[0-9]+$/.test(country_id)) {
        res.end();
        return;
    }
    (async function() {
        const promise = regionsQueries.getByCountryId(country_id);
        const [regions] = await Promise.all([promise]);
        res.json(regions);
    })();
});

module.exports = router;
