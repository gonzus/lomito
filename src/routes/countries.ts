export {};
import express = require('express');
const router = express.Router();

const models = ['countries'];
const queries = models.map(m => require(`../models/${m}.js`));

async function getData() {
    console.log("Getting countries");
    const promises = queries.map(query => query());
    const [countries] = await Promise.all(promises);
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
