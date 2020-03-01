const moment = require('moment');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "dbs.sqlite3"
    }
});


function get_data() {
    knex('work_hours').select('today', 'got_in', 'got_out').then(function (row) {
        var datetime = new Date();
        let today = datetime.toISOString().slice(0, 10);
        console.log(row)
        for (var i = 0; i < row.length; i++) {
            const list = document.getElementById("table_body");
            let d = row[i];
            if (today == d.today) {
                update_clock(d.got_in);
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

function update_clock(got_in) {
    var b = moment(new Date(), 'HH:mm:ss');
    var a = moment(got_in, 'HH:mm:ss').add(11, "hours");
    let sum;

    sum = a.diff(b);
    sum = moment.duration(sum);
    let headerTitle = document.getElementById("title");
    headerTitle.innerText = `${sum.hours()}:${sum.minutes()}:${sum.seconds()}`;

    setInterval(function () {
        // update_clock(got_in);
        if (sum.hours() !== 0) {
            clearInterval(update_clock(got_in));
        }
    }, 1);

}
get_data();