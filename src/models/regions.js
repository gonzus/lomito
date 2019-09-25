const pool = require('../db.js');

const columns = ['id', 'name', 'country_id'];

async function getAll() {
    let conn;
    try {
        console.log("Querying regions");
        conn = await pool.getConnection();
        console.log("Pool has %d / %d / %d active / total / idle connections",
                    pool.activeConnections(), pool.totalConnections(), pool.idleConnections());
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM regions
            ORDER BY name`,
        );
        const data = rows.slice();
        console.log("Queried all regions", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

async function getById(region_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying regions by id", region_id);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM regions
            WHERE id = ?
            ORDER BY name`,
            [region_id],
        );
        const data = rows.slice();
        console.log("Queried regions by id", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getByName(region_name) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying regions by name", region_name);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM regions
            WHERE name = ?
            ORDER BY name`,
            [region_name],
        );
        const data = rows.slice();
        console.log("Queried regions by name", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getLikeName(region_name) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying regions like name", region_name);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM regions
            WHERE name COLLATE utf8mb4_0900_ai_ci LIKE ?
            ORDER BY name`,
            [region_name],
        );
        const data = rows.slice();
        console.log("Queried regions like name", data.length);
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
        console.log("Querying regions by country_id", country_id);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM regions
            WHERE country_id = ?
            ORDER BY name`,
            [country_id],
        );
        const data = rows.slice();
        console.log("Queried regions by country_id", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

module.exports = { getAll, getById, getByName, getLikeName, getByCountryId };
