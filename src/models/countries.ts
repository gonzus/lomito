export {};
const pool: any = require('../db.js');

async function getAll() {
    let conn: any;
    try {
        conn = await pool.getConnection();
        console.log("Querying countries");
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
        if (conn) conn.end();
    }
}

async function getById(country_id: number) {
    let conn: any;
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
