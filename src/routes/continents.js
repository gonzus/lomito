const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const continentsQueries = require(`../models/continents.js`);

router.get('/all', (req, res) => {
    (async function() {
        const promise = continentsQueries.getAll();
        const [continents] = await Promise.all([promise]);
        res.json(continents);
    })();
});

router.get('/by_id', [
    check('id').isInt(),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const continent_id = req.query.id;
    (async function() {
        const promise = continentsQueries.getById(continent_id);
        const [continents] = await Promise.all([promise]);
        res.json(continents);
    })();
});

router.get('/by_name', [
    check('name').isAlphanumeric().isLength({ min: 3 }),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const continent_name = req.query.name;
    (async function() {
        const promise = continentsQueries.getByName(continent_name);
        const [continents] = await Promise.all([promise]);
        res.json(continents);
    })();
});

router.get('/like_name', [
    check('name').isAscii(),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const continent_name = req.query.name;
    (async function() {
        const promise = continentsQueries.getLikeName(continent_name);
        const [continents] = await Promise.all([promise]);
        res.json(continents);
    })();
});

module.exports = router;
