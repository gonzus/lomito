const express = require('express');
const app = express();

const { logger } = require('./log.js');

const expressPino = require('express-pino-logger')({
  logger: logger
})
app.use(expressPino);

const graphqlHTTP = require('express-graphql')

const schemas = ['hello','blog'];
logger.info("GraphQL Routes", schemas);
schemas.forEach(s => {
    const {schema} = require(`./schemas/${s}.js`);
    app.use(`/gql/${s}`, graphqlHTTP({
        schema: schema,
        graphiql: true,
    }));
});

const routes = ['continents', 'countries', 'regions', 'cities', 'data', 'fibonacci'];
logger.info("Routes", routes);
routes.forEach(r => app.use(`/${r}`, require(`./routes/${r}.js`)));

const port = 3000;
app.listen(port, () => {
    logger.info(`Example app listening on port ${port}!`);
});
