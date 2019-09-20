export {};
const pool: any = require('../db.js');

async function queryPeople() {
    let conn: any;
    try {
        conn = await pool.getConnection();
        console.log("Querying people");
        const rows = await conn.query("SELECT P.name person, I.name city, O.name country FROM people P join cities I on P.birth_city_id = I.id JOIN countries O ON I.country_id = O.id ORDER BY 1, 2, 3");
        const data = rows.map((r: any) => {
            return { person: r.person };
        });
        console.log("Queried people", data);
        return data;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

module.exports = queryPeople;
