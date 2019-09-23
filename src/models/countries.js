const pool = require('../db.js');

async function getAll() {
    let conn;
    try {
        console.log("Querying countries");
        conn = await pool.getConnection();
        console.log("Pool has %d / %d / %d active / total / idle connections",
                    pool.activeConnections(), pool.totalConnections(), pool.idleConnections());
        const rows = await conn.query(`
            SELECT C.id, C.name
            FROM countries C
            ORDER BY 2`,
        );
        const data = rows.slice();
        console.log("Queried all countries", data);
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
            SELECT C.id, C.name
            FROM countries C
            WHERE id = ?
            ORDER BY 2`,
            [country_id],
        );
        const data = rows.slice();
        console.log("Queried countries by id", data);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

module.exports = { getAll, getById };
