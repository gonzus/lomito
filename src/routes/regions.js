const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const regionsQueries = require(`../models/regions.js`);

router.get('/all', (req, res) => {
    (async function() {
        const promise = regionsQueries.getAll();
        const [regions] = await Promise.all([promise]);
        res.json(regions);
    })();
});

router.get('/by_id', [
    check('id').isInt(),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const region_id = req.query.id;
    (async function() {
        const promise = regionsQueries.getById(region_id);
        const [regions] = await Promise.all([promise]);
        res.json(regions);
    })();
});

router.get('/by_name', [
    check('name').isAlphanumeric().isLength({ min: 3 }),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const region_name = req.query.name;
    (async function() {
        const promise = regionsQueries.getByName(region_name);
        const [regions] = await Promise.all([promise]);
        res.json(regions);
    })();
});

router.get('/like_name', [
    check('name').isAscii(),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const region_name = req.query.name;
    (async function() {
        const promise = regionsQueries.getLikeName(region_name);
        const [regions] = await Promise.all([promise]);
        res.json(regions);
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
        const promise = regionsQueries.getByCountryId(country_id);
        const [regions] = await Promise.all([promise]);
        res.json(regions);
    })();
});

module.exports = { router };
