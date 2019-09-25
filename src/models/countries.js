const pool = require('../db.js');

const columns = ['id', 'name', 'continent_id', 'iso2', 'iso3'];

async function getAll() {
    let conn;
    try {
        console.log("Querying countries");
        conn = await pool.getConnection();
        console.log("Pool has %d / %d / %d active / total / idle connections",
                    pool.activeConnections(), pool.totalConnections(), pool.idleConnections());
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM countries
            ORDER BY name`,
        );
        const data = rows.slice();
        console.log("Queried all countries", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

async function getById(country_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying countries by id", country_id);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM countries
            WHERE id = ?
            ORDER BY name`,
            [country_id],
        );
        const data = rows.slice();
        console.log("Queried countries by id", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getByName(country_name) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying countries by name", country_name);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM countries
            WHERE name = ?
            ORDER BY name`,
            [country_name],
        );
        const data = rows.slice();
        console.log("Queried countries by name", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getLikeName(country_name) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying countries like name", country_name);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM countries
            WHERE name COLLATE utf8mb4_0900_ai_ci LIKE ?
            ORDER BY name`,
            [country_name],
        );
        const data = rows.slice();
        console.log("Queried countries like name", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getByIso2(country_iso2) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying countries by iso2", country_iso2);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM countries
            WHERE iso2 = ?
            ORDER BY name`,
            [country_iso2],
        );
        const data = rows.slice();
        console.log("Queried countries by iso2", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getByIso3(country_iso3) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying countries by iso3", country_iso3);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM countries
            WHERE iso3 = ?
            ORDER BY name`,
            [country_iso3],
        );
        const data = rows.slice();
        console.log("Queried countries by iso3", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getByContinentId(continent_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying countries by continent_id", continent_id);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM countries
            WHERE continent_id = ?
            ORDER BY name`,
            [continent_id],
        );
        const data = rows.slice();
        console.log("Queried countries by continent_id", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

module.exports = { getAll, getById, getByName, getLikeName, getByIso2, getByIso3, getByContinentId };
