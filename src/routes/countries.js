const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const countriesQueries = require(`../models/countries.js`);

router.get('/all', (req, res) => {
    (async function() {
        const promise = countriesQueries.getAll();
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

router.get('/by_id', [
    check('id').isInt(),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const country_id = req.query.id;
    (async function() {
        const promise = countriesQueries.getById(country_id);
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

router.get('/by_name', [
    check('name').isAlphanumeric().isLength({ min: 3 }),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const country_name = req.query.name;
    (async function() {
        const promise = countriesQueries.getByName(country_name);
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

router.get('/like_name', [
    check('name').isAscii(),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const country_name = req.query.name;
    (async function() {
        const promise = countriesQueries.getLikeName(country_name);
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

router.get('/by_iso2', [
    check('iso2').isAlpha().isLength({ min: 2, max: 2 }),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const country_iso2 = req.query.iso2;
    (async function() {
        const promise = countriesQueries.getByIso2(country_iso2);
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

router.get('/by_iso3', [
    check('iso3').isAlpha().isLength({ min: 3, max: 3 }),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const country_iso3 = req.query.iso3;
    (async function() {
        const promise = countriesQueries.getByIso3(country_iso3);
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

router.get('/by_continent_id', [
    check('id').isInt(),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const continent_id = req.query.id;
    (async function() {
        const promise = countriesQueries.getByContinentId(continent_id);
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

router.get('/most_populated', [
    check('min').isInt(),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const population_min = Math.max(req.query.min, 10000000);
    (async function() {
        const promise = countriesQueries.getMostPopulatedCountries(population_min);
        const [countries] = await Promise.all([promise]);
        res.json(countries);
    })();
});

module.exports = { router };
