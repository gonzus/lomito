const express = require('express');
const router = express.Router();

const continentsQueries = require(`../models/continents.js`);

router.get('/all', (req, res) => {
    (async function() {
        const promise = continentsQueries.getAll();
        const [continents] = await Promise.all([promise]);
        res.json(continents);
    })();
});

router.get('/by_id', (req, res) => {
    const continent_id = req.query.continent_id || req.query.id;
    if (!/^[0-9]+$/.test(continent_id)) {
        res.end();
        return;
    }
    (async function() {
        const promise = continentsQueries.getById(continent_id);
        const [continents] = await Promise.all([promise]);
        res.json(continents);
    })();
});

router.get('/by_name', (req, res) => {
    const continent_name = req.query.continent_name || req.query.name;
    (async function() {
        const promise = continentsQueries.getByName(continent_name);
        const [continents] = await Promise.all([promise]);
        res.json(continents);
    })();
});

router.get('/like_name', (req, res) => {
    const continent_name = req.query.continent_name || req.query.name;
    (async function() {
        const promise = continentsQueries.getLikeName(continent_name);
        const [continents] = await Promise.all([promise]);
        res.json(continents);
    })();
});

module.exports = router;
