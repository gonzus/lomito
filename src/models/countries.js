const pool = require('../db.js');

async function queryCountries() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying countries");
        const rows = await conn.query("SELECT O.name country FROM countries O ORDER BY 1");
        const data = rows.map(r => {
            return { country: r.country };
        });
        console.log("Queried countries", data);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

module.exports = queryCountries;
