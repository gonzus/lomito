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

async function getPeopleById(person_id: any) {
    console.log("Getting people by id", person_id);
    const promise = peopleQueries.getById(person_id);
    const [people] = await Promise.all([promise]);
    console.log("Got people by id");
    return people;
}

router.get('/all', (req, res) => {
    (function(){ getPeopleAll().then(data => {
        res.json(data);
    })})();
});

router.get('/by_id', (req, res) => {
    const person_id = req.query.person_id;
    (function(){ getPeopleById(person_id).then(data => {
        res.json(data);
    })})();
});

module.exports = router;
