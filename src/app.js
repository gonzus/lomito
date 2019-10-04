const express = require('express');
const app = express();

const { logger } = require('./log.js');

const expressPino = require('express-pino-logger')({
  logger: logger
})
app.use(expressPino);

const routes = ['continents', 'countries', 'regions', 'cities', 'data', 'fibonacci'];
logger.info("Routes", routes);
routes.forEach(r => app.use(`/${r}`, require(`./routes/${r}.js`)));

const port = 3000;
app.listen(port, () => {
    logger.info(`Example app listening on port ${port}!`);
});
