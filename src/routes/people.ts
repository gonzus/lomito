export {};
import express = require('express');
const router = express.Router();

const qp = require('../models/people.js');

async function getData() {
    console.log("Getting people");
    const pp = qp();
    const [people] = await Promise.all([pp]);
    console.log("Got people");
    return people;
}

router.get('/', (req, res) => {
    console.log("Calling for data");
    const getter = function(){ getData().then(data => {
        console.log("Called for data", data);
        console.log("Returning JSON");
        res.json(data);
    })};
    getter();
});

module.exports = router;
