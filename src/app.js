const express = require('express');

const app = express();
const port = 3000;

const myLogger = require('./middlewares/logger.js');

app.use(myLogger)

app.use('/cities', require('./routes/cities.js'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
