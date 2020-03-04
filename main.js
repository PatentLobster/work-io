const { app, powerMonitor, Menu, Tray, Notification, BrowserWindow } = require('electron');
const axios = require('axios');
const moment = require('moment');



// Window & Tray Section
//     Vars
let tray = undefined;
let window = undefined;

const createTray = () => {
    tray = new Tray('icon.png');
    const contextMenu = Menu.buildFromTemplate([
        { label: "Open Developer tools", click() {
                window.webContents.openDevTools()
            }},
        { label: 'Exit', click() {
            app.quit()
            }}
    ]);
    tray.setToolTip("Work-io is running");
    tray.setContextMenu(contextMenu);
    tray.on('click', function (event) {
        toggleWindow();
    })
};

const toggleWindow = () => {
    if(window === null){
        createWindow()
    } else {
        if (window.isVisible()) {
            window.hide();
            window = null;
        } else {
         showWindow();
        }
    }
};

const showWindow = () => {
    // createWindow()
    window.loadFile('src/index.html');
    const position = getWindowPosition();
    // window.reload();
    window.show();
    window.setPosition(position.x, position.y, true);
    console.log(window.getPosition())
};
const getWindowPosition = () => {
    const windowBounds = window.getBounds();
    const trayBounds = tray.getBounds();
    const x =  Math.round(trayBounds.x - (windowBounds.width / 2.333));
    const y = trayBounds.y - windowBounds.height ;
    return {x: x, y: y}
};

const createWindow = () => {
    window = new BrowserWindow({
        width: 320,
        height: 450,
        show: true,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        fullscreenable: false,
        resizable: false,
        transparent: true,
        movable: true,
        webPreferences: {
            nodeIntegration: true,
            backgroundThrottling: false,
        }
    });
    const position = getWindowPosition();
    window.setPosition(position.x, position.y, true);
    window.loadFile('src/index.html');
    window.on('hide', () => {
    window.destroy();
    });
    window.on('closed', (event) => {
        if(app.isQuiting){
           createTray();
            event.preventDefault();
        }
    });
};

// Countdown section
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
};
//     Vars
let  countDownTimer;
countDownTimer = new Date().addHours(9).toString();
let datetime = new Date();

// function getTimeRemaining(endtime){
//     let a = moment(datetime, 'HH:mm:ss');
//     let b = moment(endtime, 'HH:mm:ss');
//     let sum =b.diff(a);
//     sum = moment.duration(sum);
//     const sumText = `${sum.hours()}:${sum.minutes()}:${sum.seconds()}`;
//     return sumText;
//     // var t = Date.parse(endtime) - Date.parse(new Date());
//   // var seconds = Math.floor( (t/1000) % 60 );
//   // var minutes = Math.floor( (t/1000/60) % 60 );
//   // var hours = Math.floor( (t/(1000*60*60)) % 24 );
//   // // var days = Math.floor( t/(1000*60*60*24) );
//   // let time = `${hours}:${minutes}:${seconds}`;
//   // return time;
// }

// function initializeClock(endtime){
//     var timeinterval = setInterval(function(){
//     var t = getTimeRemaining(endtime);
//     tray.setToolTip(t);
//     if(t.total<=0){
//       clearInterval(timeinterval);
//     }
//   },1000);
// }




// DB Section
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "dbs.sqlite3"
  }
});


function log_in() {
    let today = datetime.toISOString().slice(0, 10);
    let t = moment(datetime, "HH:mm:ss");
    const now = `${t.hours()}:${t.minutes()}:${t.seconds()}`;
    return knex('work_hours')
        .select()
        .where('today', today)
        .then(function(rows) {
            if (rows.length===0) {
                // no matching records found
                // initializeClock(countDownTimer);
                return knex('work_hours').insert({'today': today, "got_in": now});
            }
        })
        .catch(function(ex) {
            // you can find errors here.
        })
}

function log_out() {
    datetime = new Date();
    let t = moment(datetime, "HH:mm:ss");
    let today = datetime.toISOString().slice(0, 10);
    const now = `${t.hours()}:${t.minutes()}:${t.seconds()}`;
    // let now = moment(datetime, 'HH:mm:ss');
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
        const quotes = response.data.quote.body;
        const author = response.data.quote.author;
        const arr = {'title': author, 'body': quotes, icon: "icon.png"};
        return arr;
    }).then((arr) => callNotification(arr) );
}

// Do nothing, important! overrides built in default to quit.
app.on('window-all-closed', () => {});

// Run app
app.on('ready', () => {
    powerMonitor.on('unlock-screen', () => {
        log_in();
        greet();
    });
    powerMonitor.on('lock-screen', () => {
        log_out();
    });
    createTray();
    createWindow();
});
