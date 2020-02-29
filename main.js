const { app, powerMonitor, Menu, Tray, Notification, BrowserWindow } = require('electron')
const axios = require('axios')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('src/index.html')

  // Open the DevTools.
  win.webContents.openDevTools()
    win.on('minimize',function(event){
        event.preventDefault();
        win.hide();
    });

    win.on('close', function (event) {
        if(!application.isQuiting){
            event.preventDefault();
            win.hide();
        }

        return false;
    });
}






// Count down section
function getTimeRemaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  // return {
  //   'total': t,
  //   'days': days,
  //   'hours': hours,
  //   'minutes': minutes,
  //   'seconds': seconds
  // };
  let time = `${hours}:${minutes}:${seconds}`
  return time;
}

function initializeClock(endtime){
    tray = new Tray('memes.png')
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Exit', click() {
            app.quit()
            }}
    ])
    tray.setToolTip("Wanna go home?")
    tray.setContextMenu(contextMenu)

    var timeinterval = setInterval(function(){
    var t = getTimeRemaining(endtime);
    // return.log(t)
    //   return t.toString();
      tray.setToolTip(t)
    if(t.total<=0){
      clearInterval(timeinterval);
    }
  },1000);
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

// let lol = initializeClock(meme);
let  meme;
meme = new Date().addHours(9).toString();



// DB Section
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "dbs.sqlite3"
  }
});

function log_in() {
    meme = new Date().addHours(9).toString();
    // initializeClock(meme)
    var datetime = new Date();
    let today = datetime.toISOString().slice(0, 10);
    let now = datetime.toISOString().match(/(\d{2}:){2}\d{2}/)[0];
    return knex('work_hours')
        .select()
        .where('today', today)
        .then(function(rows) {
            if (rows.length===0) {
                // no matching records found
                // return knex('ingredients').insert({'name': val})
                initializeClock(meme);
                return knex('work_hours').insert({'today': today, "got_in": now});
            } else {
                // initializeClock(meme)
                // return knex('work_hours').where({'today': today}).update({'got_out': now});
            }
        })
        .catch(function(ex) {
            // you can find errors here.
            initializeClock(meme)
        })
}

function log_out() {
    var datetime = new Date();
    let today = datetime.toISOString().slice(0, 10);
    let now = datetime.toISOString().match(/(\d{2}:){2}\d{2}/)[0];
    return knex('work_hours')
        .select()
        .where('today', today)
        .then(function(rows) {
            if (rows.length===0) {
                // no matching records found
                // return knex('ingredients').insert({'name': val})
                // return knex('work_hours').insert({'today': today, "got_in": now});
            } else {
                return knex('work_hours').where({'today': today}).update({'got_out': now});
            }
        })
        .catch(function(ex) {
            // you can find errors here.

        })
}


// Notifications section
function callNotification(notif){
    // const notif={
    //       title: 'Headline',
    //       body: 'Here write your message'
    //       // icon: iconAddress
    //     };
    new Notification(notif).show();
}

function greet() {
    axios.get("https://favqs.com/api/qotd").then((response) => {
        // return quote;

        const quotes = response.data.quote.body;
        const author = response.data.quote.author;
        const arr = {'title': author, 'body': quotes, icon: "memes.png"};

        return arr;
        // console.log(response.data.quote.body);
    }).then((arr) => callNotification(arr) );
}


// Run app
app.on('ready', () => {
    powerMonitor.on('unlock-screen', () => {
        // console.log("logged in")
        log_in()
        greet()
    })
    powerMonitor.on('lock-screen', () => {
        // console.log("logged out")
        log_out()
    })

    createWindow()

})