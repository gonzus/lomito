const express = require('express');
const router = express.Router();

// this is our master list of models
const models = ['people', 'cities', 'countries'];

// call `require` for each model and store results keyed by model name
// each value is the set of queries supported by that model
const queries = models.reduce(function(obj, item) {
    obj[item] = require(`../models/${item}.js`);
    return obj;
}, {});

async function getDataAll() {
    console.log("Getting all data");

    // create the promises for all models, all at once
    // this is key to having all queries running concurrently
    const promises = models.map( model => queries[model].getAll());

    // wait for all promises to complete
    const results = await Promise.all(promises);

    // create a new object keyed by model name with the data returned by promises
    const data = models.reduce(function(obj, item, index) {
        obj[item] = results[index];
        return obj;
    }, {});

    console.log("Got data");
    return data;
}

router.get('/all', (req, res) => {
    (async function() {
        const data = await getDataAll();
        res.json(data);
    })();
});

module.exports = router;
