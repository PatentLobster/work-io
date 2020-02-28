var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('dbs.sqlite3');
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS work_hours (id INTEGER PRIMARY KEY,today DATE UNIQUE NOT NULL,got_in TIME NOT NULL,got_out TIME  NULLABLE);");
});
db.close();

// async function log_time() {
//     db.serialize(function () {
//     db.run("CREATE TABLE IF NOT EXISTS work_hours (id INTEGER PRIMARY KEY,today DATE UNIQUE NOT NULL,got_in TIME NOT NULL,got_out TIME  NULLABLE);");
    // var datetime = new Date();
    // let today = datetime.toISOString().slice(0, 10);
    // let now = datetime.toISOString().match(/(\d{2}:){2}\d{2}/)[0];
    // let query = `SELECT * FROM work_hours where today='${today}'`;
    // // db.all(query, function (err, row) {
    // //     if (err) {
    // //         db.exec(`INSERT INTO work_hours(today, got_in) VALUES("${today}", "${now}")`)
    // //     } else {
    // //         console.log(row);
    // //         if (row == null || row == undefined || row == []) {
    // //             db.exec(`INSERT INTO work_hours(today, got_in) VALUES("${today}", "${now}")`)
    // //         } else {
    // //             db.exec(`UPDATE work_hours SET got_out='${now}' WHERE today='${today}'`);
    // //         }
    // //     }
    // // });
    //

    // db.each(query, function (err, row) {
    //     if(err) console.log('error', err);
    //     console.log(row);
    //       if (row != null && row != undefined && row != []) {
    //         db.exec(`UPDATE work_hours SET got_out='${now}' WHERE today='${today}'`);
    //         // db.exec(`INSERT INTO work_hours(today, got_in) VALUES("${today}", "${now}")`)
    //     } else {
    //         // db.exec(`UPDATE work_hours SET got_out='${now}' WHERE today='${today}'`);
    //         db.exec(`INSERT INTO work_hours(today, got_in) VALUES("${today}", "${now}")`)
    //     }
    // })
    // // const query = `INSERT INTO work_hours(date, got_in) VALUES("${today}", "${now}")`;
    // db.exec(query)

// })
// }

