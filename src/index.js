const moment = require('moment');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "dbs.sqlite3"
    }
});


var datetime = new Date();
let today = datetime.toISOString().slice(0, 10);
let got_in_today = null;
let counterText = undefined;
let daysList = {};
function get_data() {
    knex('work_hours').select('today', 'got_in', 'got_out').then(function (row) {
        console.log(row)
        daysList = row;
        for (var i = 0; i < row.length; i++) {
            const list = document.getElementById("table_body");
            let d = row[i];
            if (today == d.today) {
                // update_clock(d.got_in);
                got_in_today = d.got_in;
            }

            list.insertAdjacentHTML('beforeend',
                `<tr>
                  <td>${d.today}</td>
                  <td>${d.got_in}</td>
                  <td>${d.got_out}</td>
                </tr>
      `);

        }
    });
}

function update_clock() {
    let b = moment(new Date(), 'HH:mm:ss');
    let a = moment(got_in_today, 'HH:mm:ss').add(9, "hours");
    let sum;

    sum = a.diff(b);
    sum = moment.duration(sum);
    let headerTitle = document.getElementById("title");
    counterText = `${sum.hours()}:${sum.minutes()}:${sum.seconds()}`;
    headerTitle.innerText = counterText;
}


async function init() {
    setInterval(function () {
        if (got_in_today !== null){
            if (counterText !== "00:00:00") {
            update_clock()
            }
        }
    }, 1000)
}

get_data();
init();
