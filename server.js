// Tutorial: https://time2hack.com/creating-rest-api-in-node-js-with-express-and-mysql/

// Holen von der DB
const mariadb = require('mariadb');
const pool = mariadb.createPool({host: "localhost", user: "admin2", password: "1234", connectionLimit: 5, database: "mphirschmann"});

const fs = require('fs');
const archiver = require('archiver');

const path = require('path');

// -------------------------------------------------------------------------------------------------------

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

async function getAsyncFunction() {
  let conn;
  let rows;
  try {
    conn = await pool.getConnection();
    if (arguments[0] == "stations4T"){
      rows = await conn.query("SELECT DISTINCT tour_id, station_id, ordernumber, station.* FROM `tour_has_station` JOIN `station` ON `station`.`id` = `tour_has_station`.`station_id` WHERE `tour_id` = " + arguments[1] + " ORDER BY `ordernumber`;");
    }
    else if (arguments[0] == "media4S4T"){
      rows = await conn.query("SELECT * FROM `media` JOIN tour_has_station ON tour_has_station.media_id WHERE tour_has_station.station_id = " + arguments[1] + " AND media.station_id = " + arguments[1] + 
        " AND tour_has_station.tour_id = " + arguments[2] + ";")
      // rows = await conn.query("SELECT * FROM `media` JOIN `TEXT` ON `text`.`id` = `media`.`text_id` WHERE `text_id` = " + arguments[1] + ";");
    }
    else if (arguments[0] == "media4Station"){
      rows = await conn.query("SELECT media.id, `caption`, `language_id`, text.text, file.destinationurl FROM `media`"
      + " LEFT JOIN file ON file.id = media.file_id LEFT JOIN `TEXT` ON `text`.`id` = `media`.`text_id` WHERE `station_id` = " + arguments[1] + ";");
    }
    else if (arguments[0] == "stations4Template"){
      rows = await conn.query("SELECT DISTINCT template_id, station_id, ordernumber, station.* FROM `template_has_station` JOIN `station` ON `station`.`id` = `template_has_station`.`station_id` WHERE `template_id` = " + arguments[1] + " ORDER BY `ordernumber`;");
    }
    else if (arguments[0] == "media4S4Template"){
      rows = await conn.query("SELECT * FROM `media` JOIN template_has_station ON template_has_station.media_id WHERE template_has_station.station_id = " + arguments[1] + " AND media.station_id = " + arguments[1] + 
      " AND template_has_station.template_id = " + arguments[2] + ";");
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
      rows = await conn.query('INSERT INTO TOUR (title, reversible, template_id, guide, date, language_id) values (?, ?, ?, ?, ?, ?)', 
        [arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]]);

    // Tour has Station
    } else if (arguments[0] == "tourhstation"){
      id = await conn.query('SELECT * FROM `media` WHERE id=' + arguments[2] + ';');
      rows = await conn.query('INSERT INTO TOUR_HAS_STATION (tour_id, station_id, media_id, ordernumber) values (?, ?, ?, ?)', 
        [arguments[1], id[0].station_id, arguments[2], arguments[3]]);
    
    // Template
    } else if (arguments[0] == "template"){
      rows = await conn.query('INSERT INTO TEMPLATE (title) values (?)', [arguments[1]]);

    // Template has Station
    } else if (arguments[0] == "templatehstation"){
      id = await conn.query('SELECT * FROM `media` WHERE id=' + arguments[2] + ';');
      rows = await conn.query('INSERT INTO TEMPLATE_HAS_STATION (template_id, station_id, media_id, ordernumber) values (?, ?, ?, ?)', 
        [arguments[1], id[0].station_id, arguments[2], arguments[3]]);
    
    // STATION
    } else if (arguments[0] == "station"){
      rows = await conn.query('INSERT INTO STATION (name, area_id) values (?, ?)', 
        [arguments[1], arguments[2]]);
    
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

async function updateAsyncFunction(){
  let conn;
  try{
    let rows;
    conn = await pool.getConnection();

    // LANGUAGE
    if (arguments[0] == "language"){
      rows = await conn.query('UPDATE `language` SET `name`="' + arguments[2] + '" WHERE id = ' + arguments[1] + ";");
    }

    else if (arguments[0] == "area"){
        rows = await conn.query('UPDATE `area` SET `title`="' + arguments[2] + '" WHERE id=' + arguments[1] + ";");
    }

    else if (arguments[0] == "areapos"){
      rows = await conn.query('UPDATE `area` SET  `position`="' + (arguments[1] == "up" ? (arguments[3] + 1) : (arguments[3] - 1)) + '" WHERE position=' + arguments[3] + ";");
      rows = await conn.query('UPDATE `area` SET  `position`="' + arguments[3] + '" WHERE id=' + arguments[2] + ";");
    }

    else if (arguments[0] == "station"){
      rows = await conn.query('UPDATE `station` SET `name`="' + arguments[2] + '", `area_id`=' + arguments[3] + ' WHERE id=' + arguments[1] + ";");
    }

    else if (arguments[0] == "tour"){
      rows = await conn.query('UPDATE `tour` SET `title`="' + arguments[2] + '", `reversible`=' + arguments[3] + ', `guide`="' + arguments[4] +
      '", `date`="' + arguments[5] + '", `template_id`=' + arguments[6] + ', `language_id`=' + arguments[7] + ' WHERE id=' + arguments[1] + ';');
    }

    else if (arguments[0] == "tourstationpos"){
      // Put Surrounding in Place:
      rows = await conn.query('UPDATE `tour_has_station` SET `ordernumber`=' + arguments[4] + ' WHERE tour_id=' + arguments[2] + ' AND ordernumber=' +
      (arguments[1] == "up" ? arguments[4] -1: arguments[4] +1) + ';');
      // Put the actual station in place:
      rows = await conn.query('UPDATE `tour_has_station` SET `ordernumber`=' + (arguments[1] == "up" ? arguments[4] -1: arguments[4] +1) +
      ' WHERE tour_id=' + arguments[2] + ' AND station_id=' + arguments[3] +  ";");
    }

    else if (arguments[0] == "template"){
      rows = await conn.query('UPDATE `template` SET `title`="' + arguments[2] + '";');
    }

    else if (arguments[0] == "templatestationpos"){
      // Put Surrounding in Place:
      rows = await conn.query('UPDATE `template_has_station` SET `ordernumber`=' + arguments[4] + ' WHERE template_id=' + arguments[2] + ' AND ordernumber=' +
      (arguments[1] == "up" ? arguments[4] -1: arguments[4] +1) + ';');
      // Put the actual station in place:
      rows = await conn.query('UPDATE `template_has_station` SET `ordernumber`=' + (arguments[1] == "up" ? arguments[4] -1: arguments[4] +1) +
      ' WHERE template_id=' + arguments[2] + ' AND station_id=' + arguments[3] +  ";");
    }

    else{
      console.log("Ein Fehler ist aufgetreten!! Siehe updateAsyncFunction");
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
        // -----------------------------------------------------------------------------------
      } else if (table == "TOURZW"){
        rows = await conn.query("DELETE FROM TOUR_HAS_STATION WHERE tour_id=" + id + ";");
        return rows;
        // -----------------------------------------------------------------------------------
      } else if (table == "TOURZWMEDIA"){
        rows = await conn.query("DELETE FROM TOUR_HAS_STATION WHERE station_id=" + id + ";");
        return rows;
        // -----------------------------------------------------------------------------------
      } else if (table == "TEMPLATE"){
        rows = await conn.query("DELETE FROM TEMPLATE_HAS_STATION WHERE template_id=" + id + ";");
        // -----------------------------------------------------------------------------------
      } else if (table == "TEMPLATEZW"){
        rows = await conn.query("DELETE FROM TEMPLATE_HAS_STATION WHERE template_id=" + id + ";");
        return rows;
        // -----------------------------------------------------------------------------------
      } else if (table == "TEMPLATEZWMEDIA"){
        rows = await conn.query("DELETE FROM TEMPLATE_HAS_STATION WHERE station_id=" + id + ";");
        return rows;
        // -----------------------------------------------------------------------------------
      } else if (table == "STATION"){
        media = await conn.query("SELECT `file_id`, `text_id` FROM `media` WHERE `station_id`=" + id + ";");
        rows = await conn.query("DELETE FROM MEDIA WHERE station_id=" + id + ";");

        for (var i = 0; i < media.length; i++){
          rows = await conn.query("DELETE FROM " + (media[i].text_id == null && media[i].file_id != null? "FILE" + " WHERE id=" + media[i].file_id : "TEXT" + " WHERE id=" + media[i].text_id) + ";");
        }
        
        rows = await conn.query("DELETE FROM TEMPLATE_HAS_STATION WHERE station_id=" + id + ";");
        rows = await conn.query("DELETE FROM TOUR_HAS_STATION WHERE station_id=" + id + ";");
        // -----------------------------------------------------------------------------------
      } else if (table == "MEDIA"){
        media = await conn.query("SELECT `file_id`, `text_id` FROM `media` WHERE `id`=" + id + ";");
        rows = await conn.query("DELETE FROM MEDIA WHERE id=" + id + ";");

        for (var i = 0; i < media.length; i++){
          rows = await conn.query("DELETE FROM " + (media[i].text_id == null && media[i].file_id != null? "FILE WHERE id=" + media[i].file_id : "TEXT WHERE id=" + media[i].text_id) + ";");
        }
        
        rows = await conn.query("DELETE FROM TEMPLATE_HAS_STATION WHERE media_id=" + id + ";");
        rows = await conn.query("DELETE FROM TOUR_HAS_STATION WHERE media_id=" + id + ";");
        // -----------------------------------------------------------------------------------
      } else if (table == "TEMPLATE"){
        rows = await conn.query("DELETE FROM TEMPLATE_HAS_STATION WHERE template_id=" + id + ";");
        // Replace template_id in TOUR with NULL
        
        // ----------------------------------------------------------------------------------- 
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
app.get('/mediasforstationsfortour/:idS/:idT', cors(), (req, res) => {
  getAsyncFunction("media4S4T", req.params.idS, req.params.idT).then(function(val){
      res.json(val);
  });
});

// Medias when in Station when in Tour or Template
app.get('/mediasforstation/:id', cors(), (req, res) => {
  getAsyncFunction("media4Station", req.params.id).then(function(val){
      res.json(val);
  });
});

// Stations when in Template
app.get('/stationsfortemplate/:id', cors(), (req, res) => {
  getAsyncFunction("stations4Template", req.params.id).then(function(val){
    res.json(val);
  });
});

// Medias when in Station when in Template
app.get('/mediasforstationsfortemplate/:idS/:idT', cors(), (req, res) => {
  getAsyncFunction("media4S4Template", req.params.idS, req.params.idT).then(function(val){
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
    postAsyncFunction("media", req.body.language_id, val.insertId, req.body.station_id).then(function(val){
      res.json(val);
    });
  });
});

// Tour & Zw.-Tabelle
app.post('/posttour', cors(), (req, res) => {
  postAsyncFunction("tour", req.body.title, req.body.reversible, req.body.template_id, req.body.guide, req.body.date, req.body.language_id).then(function(val){
    res.json(val);
  });
});

app.post('/posttourstations', cors(), (req, res) => {
  postAsyncFunction("tourhstation", req.body.tour_id, req.body.media_id, req.body.ordernumber).then(function(val){
    res.json(val);
  });
});

// Template & Zw.-Tabelle
app.post('/posttemplate', cors(), (req, res) => {
  postAsyncFunction("template", req.body.title).then(function(val){
    res.json(val);
  });
});

app.post('/posttemplatestations', cors(), (req, res) => {
  postAsyncFunction("templatehstation", req.body.template_id, req.body.media_id, req.body.ordernumber).then(function(val){
    res.json(val);
  });
});

// ------------------------------------------------------------------------

// UPDATE
// Language
app.put('/updatelanguage', cors(), (req, res) =>{
  updateAsyncFunction("language", req.body.id, req.body.name).then(function(val){
    res.json(val);
  });
});

// Area
app.put('/updatearea', cors(), (req, res) =>{
  updateAsyncFunction("area", req.body.id, req.body.title).then(function(val){
    res.json(val);
  });
});

// Update Area Position
app.put('/updateareapos', cors(), (req, res) =>{
  updateAsyncFunction("areapos", req.body.direction, req.body.id, req.body.position).then(function(val){
    res.json(val);
  });
});

// Station
app.put('/updatestation', cors(), (req, res) =>{
  updateAsyncFunction("station", req.body.id, req.body.name, req.body.area_id).then(function(val){
    res.json(val);
  });
});

// Tour
app.put('/updatetour', cors(), (req, res) =>{
  updateAsyncFunction("tour", req.body.id, req.body.title, req.body.reversible, req.body.guide, req.body.date, req.body.template_id, req.body.language_id).then(function(val){
    res.json(val);
  });
});

// Update Tour > Station Position
app.put('/updatetourstationpos', cors(), (req, res) =>{
  updateAsyncFunction("tourstationpos", req.body.direction, req.body.tour_id, req.body.station_id, req.body.ordernumber).then(function(val){
    res.json(val);
  });
});

// Template
app.put('/updatetemplate', cors(), (req, res) =>{
  updateAsyncFunction("template", req.body.id, req.body.title).then(function(val){
    res.json(val);
  });
});

// Update Template > Station Position
app.put('/updatetemplatestationpos', cors(), (req, res) =>{
  updateAsyncFunction("templatestationpos", req.body.direction, req.body.template_id, req.body.station_id, req.body.ordernumber).then(function(val){
    res.json(val);
  });
});

// ------------------------------------------------------------------------

// DELETE
app.delete('/delete', cors(), (req, res) =>{
  deleteAsyncFunction(req.body.table.toUpperCase(), req.body.id).then(function(val){
    res.json(val);
  });
});

// ------------------------------------------------------------------------

app.listen(port, () => console.log(`App listening on port ${port}!`));

// ----------------------------------------------------------------------------------------
// Für die App
// Tutorial: https://stackabuse.com/reading-and-writing-json-files-with-node-js/


async function appAsyncFunction() {
  let conn;
  let rows;
  
  try {
    conn = await pool.getConnection();
    if(arguments[0] == "TOUR"){
      rows = await conn.query("SELECT * FROM " + arguments[0] + ";");
    }

    else if (arguments[0] == "TOUReinzeln"){
      rows = await conn.query("SELECT * FROM TOUR WHERE id = " + arguments[1] + ";");
    }

    else if (arguments[0] == "TOURinformationen"){
      rows = await conn.query("SELECT * FROM tour_has_station JOIN media ON media_id = media.id LEFT JOIN text ON media.text_id = text.id LEFT " +
      "JOIN file ON media.file_id = file.id JOIN station ON tour_has_station.station_id = station.id JOIN area ON station.area_id = area.id " +
      "WHERE tour_id= " + arguments[1] + " ORDER BY ordernumber");
    }

    else if (arguments[0] == "AREA"){
      rows = await conn.query("SELECT DISTINCT area.* FROM tour_has_station " + 
      "JOIN station ON station.id = station_id " +
      "JOIN area ON area.id = station.area_id " +
      "WHERE tour_id=" + arguments[1] + ";");
    }

    else if (arguments[0] == "STATIONTOUR"){
      rows = await conn.query("SELECT DISTINCT station.* FROM tour_has_station JOIN station ON station.id = tour_has_station.station_id WHERE tour_id=" + arguments[1] + " AND  area_id=" + arguments[2] + ";");
    }

    else if (arguments[0] == "MEDIATOUR"){
      rows = await conn.query("SELECT *, text.id AS textId, file.id AS fileId FROM tour_has_station JOIN media ON tour_has_station.media_id = media.id "+
          "LEFT JOIN text ON media.text_id=text.id LEFT JOIN file ON media.file_id=file.id " +
          "WHERE tour_id=" + arguments[1] + " AND tour_has_station.station_id=" + arguments[2] + ";");
    }

    else{
      console.log("An error occured, while trying to get all.");
      rows = null;
    }
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release(); //release to pool
  }

    return new Promise(resolve => {
      resolve(rows);
    });
}

// -------------------------------------------------------------------------------------------------------
let data;
// Get all Tours
// app.get('/toursapp', cors(), (req, res) => {
//   appAsyncFunction("TOUR").then(function(val){ // ruft die funktion auf und wenn fertig (then), dann wird die funktion mit den return wert von der funktion gemacht und der wert mit val ausgegeben
//     res.json(val);
//   });
// });

// GET each Tour
app.get('/tourapp/:id', cors(), async (req, res) => {
  let tour = await appAsyncFunction("TOUReinzeln", req.params.id);

  let result = {
    "id": tour[0].id,
    "title": tour[0].title,
    "reversible": tour[0].reversible,
    "template_id": tour[0].template_id,
    "guide": tour[0].guide,
    "date": tour[0].date
  };

result.areas = [];
let areas = await appAsyncFunction("AREA", tour[0].id);

  // load areas for tour
  areas.forEach(area => {
    let areaResult = {
        "id": area.id,
        "title": area.title,
        "position": area.position,
        "stations": []
      };
      result.areas.push(areaResult);
  });

  // load stations for area
  for (let i = 0; i < result.areas.length; i++) {
    let stations = await appAsyncFunction("STATIONTOUR", tour[0].id, areas[i].id);

    stations.forEach(el => {
      let station = {
        "id": el.id,
        "name": el.name
      };

      result.areas[i].stations.push(station);
    });

    // load media for station
    for (let i = 0; i < result.areas.length; i++) {
      for (let j = 0; j < result.areas[i].stations.length; j++) {
        let medias = await appAsyncFunction("MEDIATOUR", tour[0].id, result.areas[i].stations[j].id);
        result.areas[i].stations[j].medias = [];

        medias.forEach(ele => {
          let media = null;

          if (ele.text_id != null) {
            media = {
              "id": ele.textId,
              "type": "text",
              "caption": ele.caption,
              "text": ele.text
            };
          } else if (ele.file_id != null) {
            media = {
              "id": ele.fileId,
              "type": "file",
              "caption": ele.caption,
              "url": ele.destinationurl
            };
          }

          result.areas[i].stations[j].medias.push(media);
        });
      }
    }
  }

  await res.json(result);
  
  data = JSON.stringify(result, null, 2);

  try{
    fs.mkdirSync('tours');
  }
  catch{ console.log("Tours Repository already exists.");}
  finally{}
  // fs.mkdirSync('tours/tour_' + result.id);
  // fs.mkdirSync('tours/tour_' + result.id + '/media');
        
  // fs.writeFile('tours/tour_' + result.id + '/route.json', data, (err)=>{
  //   if (err) throw err;
  //   console.log("Data written to file.");
  // });

  // https://www.npmjs.com/package/archiver
  var output = fs.createWriteStream('tourszip/tour_' + result.id + '.zip');
  var archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });
  archive.pipe(output);

  var dir = 'tempdir';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    fs.mkdirSync(dir + "/media");
  }

  fs.writeFileSync(dir + '/route.json', data);
  // an dieser Stelle: in den tempdir/media, die Files hineinkopieren

  archive.directory('tempdir/', 'tour_' + result.id);

  // archive.append(data, {'name': "route.json"});
  archive.finalize();
});

// noch prüfen
// app.get('/downloadfile/:filename', function(req, res){
//   const file = `${__dirname}/media/` + req.params.filename;
//   console.log(file);
//   res.download(file); // Set disposition and send it.
// });

app.get('/download/:filename', function(req, res){
  const tour = `${__dirname}/tourszip/` + req.params.filename;
  console.log(tour);
  res.download(tour); // Set disposition and send it.
});

app.delete('/deletetoursapp', function(req, res){
  // https://stackoverflow.com/a/42182416
  const directory = 'tourszip';

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }

    res.json();
  });
});