const express = require('express');
const router = express.Router();

const qp = require('../models/people.js');
const qi = require('../models/cities.js');
const qo = require('../models/countries.js');

router.use(function timeLog (req, res, next) {
  console.log('All Time: ', Date.now())
  next()
});

async function getData() {
    console.log("Getting ALL");
    const pp = qp();
    const pi = qi();
    const po = qo();
    let [people, cities, countries] = await Promise.all([pp, pi, po]);
    console.log("Got ALL");
    return { people: people, cities: cities, countries: countries };
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
