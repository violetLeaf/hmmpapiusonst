// Holen von der DB
const mariadb = require('mariadb');
const pool = mariadb.createPool({host: "localhost", user: "admin2", password: "1234", connectionLimit: 5, database: "mphirschmann"});

async function asyncFunction() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tour");
    return rows;
    // rows: [ {val: 1}, meta: ... ]
 
    // const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
    // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
 
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release(); //release to pool
  }
}


// Ausgabe im Browser
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

app.get('/tours', cors(), (req, res) => {
    asyncFunction().then(function(val){ // ruft die funktion auf und wenn fertig (then), dann wird die funktion mit den return wert von der funktion gemacht und der wert mit val ausgegeben
        res.json(val);
    });
});
app.listen(port, () => console.log(`App listening on port ${port}!`));