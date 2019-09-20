const pool = require('../db.js');

async function queryCities() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Querying cities");
        const rows = await conn.query("SELECT I.name city, O.name country FROM cities I JOIN countries O ON I.country_id = O.id ORDER BY 1, 2");
        const data = rows.map(r => {
            return { city: r.city };
        });
        console.log("Queried cities", data);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

module.exports = queryCities;
