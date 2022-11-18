const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const sqlite = require('./database')
let db = sqlite.sqliteInit('music.db');
sqlite.createTable(db, 'LocationMusicList', ['id', 'MusicName', 'MusicPath', 'InsertTime'])
class AppWindow extends BrowserWindow {
  constructor(config={},  fileLocation){
    const baseConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        // preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false
      }
    }
    const finalConfig = Object.assign(baseConfig, config)
    super(finalConfig)
    this.loadFile(fileLocation)
    this.once('ready-to-show', ()=>{
      this.show()
    })
  }
}

app.on('ready', () =>{
  const mainWindow = new AppWindow({},'./index.html')
  mainWindow.webContents.on('did-finish-load', async ()=>{
    console.log('page finish load')
    let allData = await sqlite.selectAllTable(db, 'LocationMusicList')
    mainWindow.send('getData', allData)
    mainWindow.send('sqlite', db)
  })
  ipcMain.on('reload-music-list', async (event, arg)=>{
    let allData = await sqlite.selectAllTable(db, 'LocationMusicList')
    event.returnValue = allData
  })
  ipcMain.on('add-music-window', (event, arg)=>{
    const addWindow = new AppWindow({
      width: 500,
      height: 400,
      parent: mainWindow
    }, './add.html')
    ipcMain.on('load-close', (event)=>{
      addWindow.close()
    })
  })
  ipcMain.on('playId', async (event, id)=>{
    let musicPath = await sqlite.selectTable(db, 'LocationMusicList', ['id'], [id]);
    event.returnValue = musicPath
  })
  ipcMain.on('deleteId', async (event, id)=>{
    sqlite.deleteTable(db, 'LocationMusicList', ['id'], [id])
    let musicPath = await sqlite.selectAllTable(db, 'LocationMusicList')
    event.returnValue = musicPath
  })
  ipcMain.on('open-music-file', (event, arg)=>{
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        {name: 'Music', extensions: ['mp3', 'flac', 'm4a']}
      ]
    }).then(result => {
      if(result.filePaths.length > 0){
        event.sender.send('select', result.filePaths)
      }
    })
  })
  ipcMain.on('load-music-file', async (event, args)=>{
    args.forEach(async (arg)=>{
      let musicPath = arg;
      let check = await sqlite.selectTable(db, 'LocationMusicList', ['MusicPath'], [musicPath]);
      if(check == undefined){
        let id = uuidv4()
        let musicName = path.basename(arg);
        let insertTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        sqlite.insertTable(db, 'LocationMusicList', ['id', 'MusicName', 'MusicPath', 'InsertTime'], [id, musicName, musicPath, insertTime])
      }
    })
  })
})