export {};
const pool: any = require('../db.js');

async function getAll() {
    let conn: any;
    try {
        conn = await pool.getConnection();
        console.log("Querying cities");
        const rows = await conn.query(`
            SELECT C.id, C.name
            FROM cities C
            ORDER BY 2`,
        );
        const data = rows.slice();
        console.log("Queried all cities", data);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function getById(city_id: number) {
    let conn: any;
    try {
        conn = await pool.getConnection();
        console.log("Querying cities by id", city_id);
        const rows = await conn.query(`
            SELECT C.id, C.name
            FROM cities C
            WHERE id = ?
            ORDER BY 2`,
            [city_id],
        );
        const data = rows.slice();
        console.log("Queried cities by id", data);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

module.exports = { getAll, getById };
