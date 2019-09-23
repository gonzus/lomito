const pool = require('../db.js');

async function getAll() {
    let conn;
    try {
        console.log("Querying people");
        conn = await pool.getConnection();
        console.log("Pool has %d / %d / %d active / total / idle connections",
                    pool.activeConnections(), pool.totalConnections(), pool.idleConnections());
        const rows = await conn.query(`
            SELECT P.id, P.name
            FROM people P
            ORDER BY 2`,
        );
        const data = rows.slice();
        console.log("Queried all people", data);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

async function getById(person_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying people by id", person_id);
        const rows = await conn.query(`
            SELECT P.id, P.name
            FROM people P
            WHERE id = ?
            ORDER BY 2`,
            [person_id],
        );
        const data = rows.slice();
        console.log("Queried people by id", data);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

module.exports = { getAll, getById };
