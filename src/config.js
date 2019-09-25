const os = require('os');
const fs = require('fs');

const config = getConfig();

function getConfig() {
    const file = 'db.json';
    const dirs = ['.', os.homedir(), '/etc/bookings'];
    for (let j = 0; j < dirs.length; j++) {
        const path = dirs[j] + '/' + file;
        if (!fs.existsSync(path)) {
            console.log(`file ${path} does not exist`);
            continue;
        }
        const config = JSON.parse(fs.readFileSync(path, 'utf8'));
        if (!config) {
            console.log(`could not read JSON config from file ${path}`);
            continue;
        }
        console.log(`using JSON config file ${path}`);
        return config;
    }
}

function getPoolConfig(database, limit) {
    const pool_config = config.database[database].ro;

    if (pool_config.username) {
        pool_config.user = pool_config.username;
        delete pool_config.username;
    }

    if (pool_config.driver) {
        delete pool_config.driver;
    }

    if (!pool_config.database) {
        pool_config.database = database;
    }

    if (!pool_config.connectionLimit) {
        pool_config.connectionLimit = limit;
    }

    console.log('using pool config', pool_config);
    return pool_config;
}

module.exports = { getPoolConfig };
