const { ipcRenderer } = require('electron');
const { $, convertDuration } = require('./helper')
$('#add-music-button').addEventListener('click', ()=>{
    ipcRenderer.send('add-music-window')
})
const renderListHTML =  (List) =>{
    let musicList = $('#musicList')
    let musicItemsHTML = List.reduce((html, list)=>{
        html += `<li class="row list-group-item d-flex justify-content-between align-items-center">
            <div class="col-10"><i class="iconfont icon-shijiao-xiaohangxing me-4"></i>${list.MusicName.split('.')[0]}</div>
            <div class="col-2">
                <i class="me-4 hover-hand iconfont icon-bofang" data-id=${list.id}></i>
                <i class="hover-hand icon-lajitong iconfont" data-id=${list.id}></i>
            </div>
        </li>`
        return html
    }, '')
    console.log(List.length)
    musicList.innerHTML= List.length > 0 ? `<ul class="list-group">${musicItemsHTML}</ul>`: `<div>请添加音乐</div>`
}
ipcRenderer.on('getData', (event, allData)=>{
    renderListHTML(allData)
})
$('#reload-music-button').addEventListener('click', ()=>{
    let allData = ipcRenderer.sendSync('reload-music-list')
    renderListHTML(allData)
})
ipcRenderer.on('sqlite', (event, db)=>{
    console.log('connect')
    db = db;
})
let musicEvent = null
let musicAudio = new Audio()
$("#musicList").addEventListener('click', (event)=>{
    event.preventDefault();
    let {dataset, classList} = event.target;
    let id = dataset && dataset.id;
    if(id && classList.contains('icon-bofang')){
        console.log(musicAudio)
        if(musicEvent && musicEvent['id'] == id){
            musicAudio.play();
            classList.replace('icon-bofang', 'icon-bofangzanting');
        }else{
            musicEvent = ipcRenderer.sendSync('playId', id)
            musicAudio.src = musicEvent['MusicPath'];
            musicAudio.play();
            if($('.icon-bofangzanting')){
                $('.icon-bofangzanting').classList.replace('icon-bofangzanting', 'icon-bofang');
            }
            classList.replace('icon-bofang', 'icon-bofangzanting');
        }
    }else if(id && classList.contains('icon-bofangzanting')){
        musicAudio.pause()
        classList.replace('icon-bofangzanting', 'icon-bofang');
    }else if(id && classList.contains('icon-lajitong')){
        ipcRenderer.send('deleteId', id)
    }
})
let renderPlayerHTML = (name, duration) => {
    let player = $('#player-status');
    let html = `
                <div class="col font-weight-bold">
                    正在播放:${name}
                </div>
                <div class="col">
                    <span id="current-seeker">00:00</span> / <span>${convertDuration(duration)}</span>
                </div>
    `
    player.innerHTML = html;
}
let updateProgressHTML = (currentTime, duration)=>{
    let seeker = $('#current-seeker');
    let playerBar = $('#player-bar')
    seeker.innerHTML = convertDuration(currentTime)
    let barWidth = currentTime / duration * 100
    playerBar.style.width = barWidth +'%';
    playerBar.innerText = Math.floor(barWidth) > 10 ? Math.floor(barWidth) + '%': "0" + Math.floor(barWidth) + '%';
    if(currentTime == duration){
        $('.icon-bofangzanting').classList.replace('icon-bofangzanting', 'icon-bofang');
    }
}
musicAudio.addEventListener('loadedmetadata', ()=>{
    // 渲染播放器状态
    renderPlayerHTML(musicEvent['MusicName'], musicAudio.duration)
})
musicAudio.addEventListener('timeupdate', (event)=>{
    // 更新播放器状态
    updateProgressHTML(musicAudio.currentTime, musicAudio.duration)
})