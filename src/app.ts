const express = require('express');

const app = express();
const port = 3000;

const myLogger = require('./middlewares/logger.js');

app.use(myLogger)

app.use('/people', require('./routes/people.js'));
app.use('/cities', require('./routes/cities.js'));
app.use('/countries', require('./routes/countries.js'));
app.use('/all', require('./routes/all.js'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
