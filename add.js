const { $ } = require('./helper')
const { ipcRenderer } = require('electron');
const path = require('path')

$('#select-music').addEventListener('click', ()=>{
    ipcRenderer.send('open-music-file')
})

$('#load-music').addEventListener('click', ()=>{
    if(MusicFilePaths.length>0){
        ipcRenderer.send('load-music-file', MusicFilePaths)
        ipcRenderer.send('load-close')
    }
})
let MusicFilePaths = []
const renderListHTML =  (paths) =>{
    let musicList = $('#musicList');
    let musicItemsHTML = paths.reduce((html, music)=>{
        html += `<li class="list-group-item">${path.basename(music)}</li>`
        return html
    }, '')
    musicList.innerHTML= `<ul class="list-group">${musicItemsHTML}</ul>`
}
ipcRenderer.on('select', (event, path)=>{
    MusicFilePaths = path;
    renderListHTML(path);
})