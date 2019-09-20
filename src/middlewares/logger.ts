import express = require('express');

function myLogger(req: express.Request, res: express.Response, next: any) {
    const now = new Date();
    console.log(`===== ${now.toISOString()} =====`);
    console.log({
        method     : req.method,
        hostname   : req.hostname,
        originalUrl: req.originalUrl,
        path       : req.path,
        query      : req.query,
        params     : req.params,
        headers    : req.headers,
        cookies    : req.cookies,
    });
    next();
}

module.exports = myLogger;
