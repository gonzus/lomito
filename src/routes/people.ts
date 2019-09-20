export {};
import express = require('express');
const router = express.Router();

const models = ['people'];
const queries = models.map(m => require(`../models/${m}.js`));

async function getData() {
    console.log("Getting people");
    const promises = queries.map(query => query());
    const [people] = await Promise.all(promises);
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
