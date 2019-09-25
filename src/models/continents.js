const pool = require('../db.js');

const columns = ['id', 'name'];

async function getAll() {
    let conn;
    try {
        console.log("Querying continents");
        conn = await pool.getConnection();
        console.log("Pool has %d / %d / %d active / total / idle connections",
                    pool.activeConnections(), pool.totalConnections(), pool.idleConnections());
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM continents
            ORDER BY 2`,
        );
        const data = rows.slice();
        console.log("Queried all continents", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

async function getById(continent_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying continents by id", continent_id);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM continents
            WHERE id = ?
            ORDER BY 2`,
            [continent_id],
        );
        const data = rows.slice();
        console.log("Queried continents by id", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getByName(continent_name) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying continents by name", continent_name);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM continents
            WHERE name = ?
            ORDER BY 2`,
            [continent_name],
        );
        const data = rows.slice();
        console.log("Queried continents by name", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getLikeName(continent_name) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying continents like name", continent_name);
        const rows = await conn.query(`
            SELECT ${columns.join(',')}
            FROM continents
            WHERE name COLLATE utf8mb4_0900_ai_ci LIKE ?
            ORDER BY 2`,
            [continent_name],
        );
        const data = rows.slice();
        console.log("Queried continents like name", data.length);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

module.exports = { getAll, getById, getByName, getLikeName };
