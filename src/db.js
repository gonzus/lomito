const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'gonzo',
  password: 'gonzo',
  database: 'trips'
});
conn.connect(); // TODO: when to disconnect?

module.exports = conn;
