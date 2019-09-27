const express = require('express');
const router = express.Router();

const fibQueries = require(`../models/fibonacci.js`);

function getNumbers(req, name) {
    const n = req.query[name];
    return Array.isArray(n) ? n : [n];
}

router.get('/c', (req, res) => {
    const numbers = getNumbers(req, 'n');
    (async function() {
        console.log('Calling model fib C', numbers);
        const promises = numbers.map(n => fibQueries.getFibonacciC([n]));;
        const results = await Promise.all(promises);
        const data = [].concat.apply([], results);
        res.json(data);
    })();
});

router.get('/js', (req, res) => {
    const numbers = getNumbers(req, 'n');
    (async function() {
        console.log('Calling model fib JS', numbers);
        const promises = numbers.map(n => fibQueries.getFibonacciJS([n]));;
        const results = await Promise.all(promises);
        const data = [].concat.apply([], results);
        res.json(data);
    })();
});

module.exports = router;
