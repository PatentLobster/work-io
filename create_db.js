var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('dbs.sqlite3');
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS work_hours (id INTEGER PRIMARY KEY,today DATE UNIQUE NOT NULL,got_in TIME NOT NULL,got_out TIME  NULLABLE);");
});
db.close();
