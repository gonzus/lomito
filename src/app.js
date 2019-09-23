const express = require('express');
const app = express();
const port = 3000;

const myLogger = require('./middlewares/logger.js');
app.use(myLogger)

const configs = require('./config.js');
const routes = configs.getAppConfig().routes;
console.log("Routes", routes);
routes.forEach(r => app.use(`/${r}`, require(`./routes/${r}.js`)));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
