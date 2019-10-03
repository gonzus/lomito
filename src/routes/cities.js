const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const citiesQueries = require(`../models/cities.js`);

router.get('/all', (req, res) => {
    (async function(){
        const promise = citiesQueries.getAll();
        const [cities] = await Promise.all([promise]);
        res.json(cities);
    })();
});

router.get('/by_id', [
    check('id').isInt(),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const city_id = req.query.id;
    (async function() {
        const promise = citiesQueries.getById(city_id);
        const [cities] = await Promise.all([promise]);
        res.json(cities);
    })();
});

router.get('/by_name', [
    check('name').isAlphanumeric().isLength({ min: 3 }),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const city_name = req.query.name;
    (async function() {
        const promise = citiesQueries.getByName(city_name);
        const [cities] = await Promise.all([promise]);
        res.json(cities);
    })();
});

router.get('/like_name', [
    check('name').isAscii(),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const city_name = req.query.name;
    (async function() {
        const promise = citiesQueries.getLikeName(city_name);
        const [cities] = await Promise.all([promise]);
        res.json(cities);
    })();
});

router.get('/by_region_id', [
    check('id').isInt(),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const region_id = req.query.id;
    (async function() {
        const promise = citiesQueries.getByRegionId(region_id);
        const [cities] = await Promise.all([promise]);
        res.json(cities);
    })();
});

router.get('/by_country_id', [
    check('id').isInt(),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const country_id = req.query.id;
    (async function() {
        const promise = citiesQueries.getByCountryId(country_id);
        const [cities] = await Promise.all([promise]);
        res.json(cities);
    })();
});

router.get('/most_populated', [
    check('min').isInt(),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const population_min = Math.max(req.query.min, 1000000);
    (async function() {
        const promise = citiesQueries.getMostPopulatedCities(population_min);
        const [cities] = await Promise.all([promise]);
        res.json(cities);
    })();
});

router.get('/close_cities_in_different_countries', [
    check('delta_lat_max').isFloat({ min: 0, max: 0.01 }),
    check('delta_lon_max').isFloat({ min: 0, max: 0.1 }),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const delta_lat_max = Math.min(req.query.delta_lat_max, 0.01);
    const delta_lon_max = Math.min(req.query.delta_lon_max, 0.1);
    (async function() {
        const promise = citiesQueries.getCloseCitiesInDifferentCountries(delta_lat_max, delta_lon_max);
        const [cities] = await Promise.all([promise]);
        res.json(cities);
    })();
});

module.exports = router;
