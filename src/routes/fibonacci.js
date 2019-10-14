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
        const promises = numbers.map(n => fibQueries.getFibonacciJS(n));;
        console.log('Gathered all promises fib JS', promises);
        const results = await Promise.all(promises);
        console.log('Awaited all promises fib JS', results);
        const data = [].concat.apply([], results);
        console.log('Got all data fib JS', data);
        res.json(data);
    })();
});

module.exports = { router };
