// Tutorial: https://time2hack.com/creating-rest-api-in-node-js-with-express-and-mysql/

// Holen von der DB
const mariadb = require('mariadb');
const pool = mariadb.createPool({host: "localhost", user: "admin2", password: "1234", connectionLimit: 5, database: "mphirschmann"});

// Für die Connection auf die DB -- GET
async function asyncFunction(wtable) {
  let conn;
  try {
    conn = await pool.getConnection();
    if(wtable === String){
      const rows = await conn.query("SELECT * FROM " + wtable);
      return rows;
      // rows: [ {val: 1}, meta: ... ]
   
      // const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
      // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
    }
    else{
      console.log("Fehler bei === String.")
    }
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
// app.use(cors());
app.use((req,res,next) => {
  // CORS, damit keine Violation auftritt
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});


// GET ALL
app.get('/tours', cors(), (req, res) => {
    asyncFunction("TOUR").then(function(val){ // ruft die funktion auf und wenn fertig (then), dann wird die funktion mit den return wert von der funktion gemacht und der wert mit val ausgegeben
        res.json(val);
    });
});

// funktioniert nicht
app.get('/stations', cors(), (req, res) => {
  asyncFunction("STATION").then(function(val){
      res.json(val);
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));