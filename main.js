const { app, powerMonitor, Menu, Tray, Notification, BrowserWindow, ipcMain } = require('electron')
const axios = require('axios')

let tray = undefined;
let window = undefined;

const createTray = () => {
    tray = new Tray('icon.png');
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Exit', click() {
            app.quit()
            }}
    ])
    tray.setToolTip("Work-io is running")
    tray.setContextMenu(contextMenu)
    tray.on('click', function (event) {
        toggleWindow();
    })
}

const toggleWindow = () => {
    window.isVisible() ? window.hide() : showWindow();
}

const showWindow = () => {
    const position = getWindowPosition();
    window.show();
    window.reload();
    window.setPosition(position.x, position.y, true);
    console.log(window.getPosition())
}

const getWindowPosition = () => {
    const windowBounds = window.getBounds();
    const trayBounds = tray.getBounds();
    const x = Math.round(trayBounds.x - (windowBounds.height / 4))
    const y = Math.round((trayBounds.y + trayBounds.height + 120)/2)
    console.log("yyyyy", y)
    return {x: x, y: y}
}

const createWindow = () => {
    window = new BrowserWindow({
        width: 320,
        height: 450,
        show: true,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    window.loadFile('src/index.html');
}



// Count down section
function getTimeRemaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  let time = `${hours}:${minutes}:${seconds}`
  return time;
}

function initializeClock(endtime){
    tray = new Tray('icon.png')
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Exit', click() {
            app.quit()
            }}
    ])
    tray.setToolTip("Wanna go home?")
    tray.setContextMenu(contextMenu)

    var timeinterval = setInterval(function(){
    var t = getTimeRemaining(endtime);
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
                initializeClock(meme);
                return knex('work_hours').insert({'today': today, "got_in": now});
            } else {

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
                const arr = {'title': "Didnt save", 'body': "You logged out before you logged in", icon: "icon.png"};
                callNotification(arr)
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
    new Notification(notif).show();
}

function greet() {
    axios.get("https://favqs.com/api/qotd").then((response) => {
        // return quote;

        const quotes = response.data.quote.body;
        const author = response.data.quote.author;
        const arr = {'title': author, 'body': quotes, icon: "icon.png"};

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

    createTray();
    createWindow();
    // createWindow()

})