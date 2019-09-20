const express = require('express');
const router = express.Router();

const qi = require('../models/cities.js');

router.use(function timeLog (req, res, next) {
  console.log('Cities Time: ', Date.now())
  next()
});

async function getData() {
    console.log("Getting cities");
    const pi = qi();
    const [cities] = await Promise.all([pi]);
    console.log("Got cities");
    return cities;
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
