import mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'gonzo',
    password: 'gonzo',
    database: 'trips',
    connectionLimit: 5,
});

module.exports = pool;
