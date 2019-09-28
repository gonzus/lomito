const Worker = require('webworker-threads').Worker;

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

async function getFibonacciJS(x) {
    // each fib computation is done in the same calling thread, we DO NOT get
    // real paralellism here; we would need to spawn worker threads, but so far
    // the module to do this is now working on my laptop --
    // https://github.com/audreyt/node-webworker-threads
    console.log('Calling JS fib', x);
    const arch = process.arch;
    const platform = process.platform;
    const pid = process.pid;
    let promise = new Promise(function(resolve, reject) {
        const n = +x;
        let t0 = process.hrtime();

        let worker = new Worker(function() {
            this.onmessage = function(event) {
                const fib = function (n) {
                    return (n <= 1) ? n : fib(n-1) + fib(n-2);
                };
                const n = event.data.n;
                console.log("In thread %d, worker got [%d]", thread.id, n);
                const f = fib(n);
                postMessage({f});
                self.close();
            };
        });
        worker.onmessage = function(event) {
            const f = event.data.f;
            console.log("In parent, worker replied with [%d]", f);
            const t1 = process.hrtime(t0);
            const elapsed_us = Math.trunc(t1[0] * 1000000 + t1[1] / 1000);
            const obj = {arch, platform, pid, lang: "JS", n, fib: f, elapsed_us};
            resolve(obj);
        };
        console.log("In parent, requesting [%d]", n);
        worker.postMessage({n});
    });
    console.log('Called JS fib', promise);
    return promise;
}

module.exports = { getFibonacciC, getFibonacciJS };
