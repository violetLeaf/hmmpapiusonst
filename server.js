// Tutorial: https://time2hack.com/creating-rest-api-in-node-js-with-express-and-mysql/

// Holen von der DB
const mariadb = require('mariadb');
const pool = mariadb.createPool({host: "localhost", user: "admin2", password: "1234", connectionLimit: 5, database: "mphirschmann"});

// -------------------------------------------------------------------------------------------------------

// Für die Connection auf die DB -- GET ALL
async function getallAsyncFunction(wtable) {
  let conn;
  try {
    conn = await pool.getConnection();
    if(wtable != null){
      const rows = await conn.query("SELECT * FROM " + wtable + ";");
      return rows;
    }
    else{
      console.log("An error occured, while trying to get all.")
    }
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release(); //release to pool
  }
}

// -------------------------------------------------------------------------------------------------------

async function getAsyncFunction(table, id) {
  let conn;
  let rows;
  try {
    conn = await pool.getConnection();
    if ( table == "stations4T"){
      rows = await conn.query("SELECT * FROM `tour_has_station` JOIN `station` ON `station`.`id` = `tour_has_station`.`station_id` WHERE `tour_id` = " + id + " ORDER BY `ordernumber`;");
    }
    else if (table == "media4S4T"){
      rows = await conn.query("SELECT * FROM `media` JOIN `TEXT` ON `text`.`id` = `media`.`text_id` WHERE `text_id` = " + id + ";");
    }
    return rows;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release(); //release to pool
  }
}

// -------------------------------------------------------------------------------------------------------

async function postAsyncFunction(){
  let conn;
  try{
    let rows;
    conn = await pool.getConnection();

    // TOUR
    if (arguments[0] == "tour"){
      rows = await conn.query('INSERT INTO TOUR (title, reversible, template_id, guide, date) values (?, ?, ?, ?, ?)', 
        [arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]]);

        
    } else if (arguments[0] == "tourhstation"){
      rows = await conn.query('INSERT INTO TOUR_HAS_STATION (tour_id, station_id, media_id, ordernumber) values (?, ?, ?, ?)', 
        [arguments[1], arguments[2], arguments[3], arguments[4]]);
    
    // STATION
    } else if (arguments[0] == "station"){
      rows = await conn.query('INSERT INTO STATION (name, area_id) values (?, ?)', 
        [arguments[1], arguments[2], arguments[3]]);
    
    // TEXT
    } else if (arguments[0] == "text"){
      rows = await conn.query('INSERT INTO TEXT (text) values (?)', 
        [arguments[1]]);
    
    // MEDIA
    } else if (arguments[0] == "media"){
      rows = await conn.query('INSERT INTO MEDIA (language_id, text_id, station_id) values (?, ?, ?)', 
        [arguments[1], arguments[2], arguments[3]]);

    // LANGUAGE
    } else if (arguments[0] == "language"){
      rows = await conn.query('INSERT INTO LANGUAGE (name) values (?)', 
        [arguments[1]]);

    // AREA
    } else if (arguments[0] == "area"){
      rows = await conn.query('INSERT INTO AREA (title, position) values (?, ?)', 
        [arguments[1], arguments[2]]);
    
    } else{
      console.log("Ein Fehler ist aufgetreten!! Siehe postAsyncFunction");
      rows = null;
    }

    return rows;

  } catch(err){
    throw err;
  } finally{
    if (conn) conn.release(); //release to pool
  }
}

// -------------------------------------------------------------------------------------------------------

async function deleteAsyncFunction(table, id){
  let conn;
  try{
    conn = await pool.getConnection();
    if (table != null && id != null) {

      // auf anderen Tabellen löschen
      if (table == "TOUR"){
        rows = await conn.query("DELETE FROM TOUR_HAS_STATION WHERE tour_id=" + id + ";");
        
      } else if (table == "STATION"){
        deleteMediaAsyncFunction(id, "TEXT", table.toLowerCase());

      } else if (table == "MEDIA"){
        deleteMediaAsyncFunction(id, "TEXT", table.toLowerCase());

      } else if (table == "TEMPLATE"){
        rows = await conn.query("DELETE FROM TEMPLATE_HAS_STATION WHERE template_id=" + id + ";");
        // Replace template_id in TOUR with NULL

      }

      // auf eigentlicher Tabelle löschen
      rows = await conn.query("DELETE FROM " + table + " WHERE id=" + id + ";");
      return rows;
    }
    else{
      console.log("An error occured, while trying to delete.")
    }
  }catch(err){
    throw err;
  } finally {
    if (conn) conn.release(); //release to pool
  }
}


// funktioniert noch nicht!!!!
async function deleteMediaAsyncFunction(id, mediatype, type){
  let conn;
  let m_id = id;
  try{
    conn = await pool.getConnection();
    if (type != null && id != null) {
      // sollte die text_id sein? oder die file_id? wie kann man die bekommen?
      rows = await conn.query("DELETE FROM " + mediatype + " WHERE id=" + m_id + ";");
      rows = (type == "media" ? null : await conn.query("DELETE FROM MEDIA WHERE id=" + id + ";"));
      
      rows = await conn.query("DELETE FROM TEMPLATE_HAS_STATION WHERE " + type + "_id=" + id + ";");
      rows = await conn.query("DELETE FROM TOUR_HAS_STATION WHERE " + type + "_id=" + id + ";");
      return rows;
    }
    else{
      console.log("An error occured.")
    }
  }catch(err){
    throw err;
  } finally {
    if (conn) conn.release(); //release to pool
  }
}

// -------------------------------------------------------------------------------------------------------


// Ausgabe im Browser
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use((req,res,next) => {
  // CORS, damit keine Violation auftritt
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

// -------------------------------------------------------------------------------------------------------

// GET ALL
// Touren
app.get('/tours', cors(), (req, res) => {
  getallAsyncFunction("TOUR").then(function(val){ // ruft die funktion auf und wenn fertig (then), dann wird die funktion mit den return wert von der funktion gemacht und der wert mit val ausgegeben
        res.json(val);
    });
});

// Stationen
app.get('/stations', cors(), (req, res) => {
  getallAsyncFunction("STATION").then(function(val){
      res.json(val);
  });
});

// Templates
app.get('/templates', cors(), (req, res) => {
  getallAsyncFunction("TEMPLATE").then(function(val){
      res.json(val);
  });
});

// Languages
app.get('/languages', cors(), (req, res) => {
  getallAsyncFunction("LANGUAGE").then(function(val){
      res.json(val);
  });
});

// Area
app.get('/areas', cors(), (req, res) => {
  getallAsyncFunction("AREA").then(function(val){
      res.json(val);
  });
});

// -------------------------------------------------------------------------------------------------------

// GETs
// Stations when in Tour
app.get('/stationsfortour/:id', cors(), (req, res) => {
  getAsyncFunction("stations4T", req.params.id).then(function(val){
    res.json(val);
  });
});

// Medias when in Station when in Tour
app.get('/mediasforstationsfortour/:id', cors(), (req, res) => {
  getAsyncFunction("media4S4T", req.params.id).then(function(val){
      res.json(val);
  });
});

// ------------------------------------------------------------------------

// POST
// Station
app.post('/poststation', cors(), (req, res) => {
  postAsyncFunction("station", req.body.name, req.body.area_id).then(function(val){
    res.json(val);
  });
});

// Language
app.post('/postlanguage', cors(), (req, res) => {
  postAsyncFunction("language", req.body.name).then(function(val){
    res.json(val);
  });
});

// Area
app.post('/postarea', cors(), (req, res) => {
  postAsyncFunction("area", req.body.title, req.body.position).then(function(val){
    res.json(val);
  });
});

// Text & MEDIA ADDEN
app.post('/posttext', cors(), (req, res) => {
  postAsyncFunction("text", req.body.text).then(function(val){
    postAsyncFunction("media", 3, val.insertId, req.body.station_id).then(function(val){
      res.json(val);
    });
  });
});

// Tour & Zw.-Tabelle
app.post('/posttour', cors(), (req, res) => {
  postAsyncFunction("tour", req.body[0].title, req.body[0].reversible, req.body[0].template_id, req.body[0].guide, req.body[0].date).then(function(val){
    postAsyncFunction("tourhstation", val.insertId, req.body[1].station_id, req.body[1].media_id, req.body[1].ordernumber).then(function(val){
      res.json(val);
    });
  });
});

// app.post('/posttourstations', cors(), (req, res) => {
//   postAsyncFunction("tourhstation", val.insertId, req.body.station_id, req.body.media_id, req.body.ordernumber).then(function(val){
//     res.json(val);
//   });
// });

// ------------------------------------------------------------------------

// UPDATE


// ------------------------------------------------------------------------

// DELETE
app.delete('/delete', cors(), (req, res) =>{
  deleteAsyncFunction(req.body.table.toUpperCase(), req.body.id).then(function(val){
    res.json(val);
  });
});

// ------------------------------------------------------------------------

app.listen(port, () => console.log(`App listening on port ${port}!`));