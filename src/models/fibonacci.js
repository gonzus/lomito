const execa = require('execa');

async function getFibonacciC(numbers) {
    // each fib computation is done by a separate process (and returned as a
    // promise), we DO get real paralellism here -- \o/
    console.log('Calling C fib', numbers);
    const {stdout} = await execa('./src/fib/c/fib', numbers);
    const data = JSON.parse(stdout);
    console.log('Called C fib', stdout);
    return data;
}

function fib(n) {
    if (n <= 1) {
        return n;
    } else {
        return fib(n-1) + fib(n-2);
    }
}

async function getFibonacciJS(numbers) {
    // each fib computation is done in the same calling thread, we DO NOT get
    // real paralellism here; we would need to spawn worker threads, but so far
    // the module to do this is now working on my laptop --
    // https://github.com/audreyt/node-webworker-threads
    console.log('Calling JS fib', numbers);
    const arch = process.arch;
    const platform = process.platform;
    const pid = process.pid;
    let data = [];
    numbers.forEach(x => {
        const n = +x;
        const h = process.hrtime();
        const f = fib(n);
        const t = process.hrtime(h);
        const elapsed_us = Math.trunc(t[0] * 1000000 + t[1] / 1000);
        data.push({arch, platform, pid, lang: "JS", n, fib: f, elapsed_us});
    });
    console.log('Called JS fib', data);
    return data;
}

module.exports = { getFibonacciC, getFibonacciJS };
