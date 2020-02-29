const moment =require('moment');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "dbs.sqlite3"
  }
});


function get_data() {
  knex('work_hours').select('today', 'got_in', 'got_out').then(function (projectNames) {
    //do something here
    // console.log(projectNames);
    // return projectNames;
    var datetime = new Date();
    let today = datetime.toISOString().slice(0, 10);
    console.log(projectNames)
    for( var i = 0; i < projectNames.length; i++ )
    {
      const list = document.getElementById("table_body");
      let d = projectNames[i];
      if(today == d.today) {
        update_clock(d.got_in);
      }
      // console.log(projectNames[i].today+'\n');
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
    let headerTitle = document.getElementById("title");
    sum = a.diff(b);
    sum = moment.duration(sum);
    // var b = moment("21:00:55", 'HH:mm:ss');
      headerTitle.innerText = `${sum.hours()}:${sum.minutes()}:${sum.seconds()}`;
      setInterval(function () {
        if(sum.hours() !== 0) {
          update_clock(got_in)

        }
      })
}

get_data()