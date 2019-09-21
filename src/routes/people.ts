export {};
import express = require('express');
const router = express.Router();

const peopleQueries = require(`../models/people.js`);

async function getPeopleAll() {
    console.log("Getting all people");
    const promise = peopleQueries.getAll();
    const [people] = await Promise.all([promise]);
    console.log("Got people");
    return people;
}

async function getPersonById(person_id: any) {
    console.log("Getting person by id", person_id);
    const promise = peopleQueries.getById(person_id);
    const [people] = await Promise.all([promise]);
    console.log("Got person by id");
    return people;
}

router.get('/all', (req, res) => {
    (async function() {
        const data = await getPeopleAll();
        res.json(data);
    })();
});

router.get('/by_id', (req, res) => {
    const person_id = req.query.person_id || req.query.id;
    if (!/^[0-9]+$/.test(person_id)) {
        res.end();
        return;
    }
    (async function() {
        const data = await getPersonById(person_id);
        res.json(data);
    })();
});

module.exports = router;
