const pool = require('../db.js');

const columns = ['id', 'name', 'region_id', 'country_id', 'lat', 'lon', 'population', 'external_id'];

async function getAll() {
    let conn;
    try {
        console.log("Querying cities");
        conn = await pool.getConnection();
        console.log("Pool has %d / %d / %d active / total / idle connections",
                    pool.activeConnections(), pool.totalConnections(), pool.idleConnections());
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM cities
            ORDER BY name`,
        );
        const data = rows.slice();
        console.log("Queried all cities", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

async function getById(city_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying cities by id", city_id);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM cities
            WHERE id = ?
            ORDER BY name`,
            [city_id],
        );
        const data = rows.slice();
        console.log("Queried cities by id", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getByName(city_name) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying cities by name", city_name);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM cities
            WHERE name = ?
            ORDER BY name`,
            [city_name],
        );
        const data = rows.slice();
        console.log("Queried cities by name", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getLikeName(city_name) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying cities like name", city_name);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM cities
            WHERE name COLLATE utf8mb4_0900_ai_ci LIKE ?
            ORDER BY name`,
            [city_name],
        );
        const data = rows.slice();
        console.log("Queried cities like name", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getByRegionId(region_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying cities by region_id", region_id);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM cities
            WHERE region_id = ?
            ORDER BY name`,
            [region_id],
        );
        const data = rows.slice();
        console.log("Queried cities by region_id", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getByCountryId(country_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying cities by country_id", country_id);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM cities
            WHERE country_id = ?
            ORDER BY name`,
            [country_id],
        );
        const data = rows.slice();
        console.log("Queried cities by country_id", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getMostPopulatedCities(population_min) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying most populated cities", population_min);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM cities
            WHERE population >= ?
            ORDER BY name`,
            [population_min],
        );
        const data = rows.slice();
        console.log("Queried most populated cities", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getCloseCitiesInDifferentCountries(dlat_max, dlon_max) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying close cities in different countries", dlat_max, dlon_max);
        const city_1_columns = columns.map(c => `city_1.${c}`);
        const city_2_columns = columns.map(c => `city_2.${c}`);
        const rows = await conn.query(
            {
                nestTables: true, // namespacing for free!
                sql: `
                    SELECT ${city_1_columns.concat(city_2_columns).join(',')}
                    FROM cities city_1,
                         cities city_2
                    WHERE city_1.id < city_2.id AND
                          city_1.country_id != city_2.country_id AND
                          ABS(city_1.lat - city_2.lat) <= ? AND
                          ABS(city_1.lon - city_2.lon) <= ?`,
            },
            [dlat_max, dlon_max],
        );
        const data = rows.slice();
        console.log("Queried close cities in different countries", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

module.exports = {
    getAll, getById, getByName, getLikeName, getByRegionId, getByCountryId,
    getMostPopulatedCities, getCloseCitiesInDifferentCountries,
};
