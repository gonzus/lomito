export {};
import express = require('express');
const router = express.Router();

const models = ['cities'];
const queries = models.map(m => require(`../models/${m}.js`));

async function getData() {
    console.log("Getting cities");
    const promises = queries.map(query => query());
    const [cities] = await Promise.all(promises);
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
