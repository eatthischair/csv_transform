const { Client } = require("pg")
const fs = require("fs");
const { parse } = require("csv-parse");
const dotenv = require("dotenv")
dotenv.config()

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: 'platypus1',
  port: process.env.PGPORT
  })
  client.connect();

  // const text = 'INSERT INTO answers_photos VALUES($1, $2, $3) RETURNING *';

fs.createReadStream('./answers_photos.csv')
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    var newUrl = row[2].split('photo-')[1]
    row[2] = newUrl
    // console.log(row);
    client.query('INSERT INTO answers_photos VALUES($1, $2, $3)', row, (err, res) => {
      if (err) {
        console.log('err', err.stack);
      } else {
        console.log('success', res)
      }
    })
  })
  .on("end", function () {
    console.log("finished");
  })
  .on("error", function (error) {
    console.log(error.message);
  });