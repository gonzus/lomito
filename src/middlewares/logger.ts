import express = require('express');

function myLogger(req: express.Request, res: express.Response, next: any) {
    console.log(`=== ${ req.method } ===`);
    console.log("hostname", req.hostname);
    console.log("originalUrl", req.originalUrl);
    console.log("params", req.params);
    console.log("headers", req.headers);
    console.log("cookies", req.cookies);
    console.log(`--- ${ req.method } ---`);

    next();
}

module.exports = myLogger;
