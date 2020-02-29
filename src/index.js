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

    console.log(projectNames)
    for( var i = 0; i < projectNames.length; i++ )
    {
      const list = document.getElementById("lol");
      let d = projectNames[i];
      // console.log(projectNames[i].today+'\n');
      list.insertAdjacentHTML('beforeend',
          `<li>Date ${d.today} | Got in ${d.got_in} | Got Out ${d.got_out} </li>
      `);

    }
  });
}


function render_data() {
  let data;
  data = get_data();
  console.log(data);

}

get_data()