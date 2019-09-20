const express = require('express');
const router = express.Router();

const qo = require('../models/countries.js');

router.use(function timeLog (req, res, next) {
  console.log('Countries Time: ', Date.now())
  next()
});

async function getData() {
    console.log("Getting countries");
    const po = qo();
    const [countries] = await Promise.all([po]);
    console.log("Got countries");
    return countries;
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
