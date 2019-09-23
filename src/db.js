const configs = require('./config.js');
const config = configs.getPoolConfig('rescore_limited', 5);

const mariadb = require('mariadb');
const pool = mariadb.createPool(config);

module.exports = pool;
