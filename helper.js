exports.$ = (element)=>{
    return document.querySelector(element)
}
exports.convertDuration = (time) => {
    let minutes = Math.floor(time / 60) >= 10?Math.floor(time / 60) : "0" + Math.floor(time / 60);
    let seconds = Math.floor(time - minutes*60) >= 10?Math.floor(time - minutes*60): "0" +Math.floor(time - minutes*60)
    return minutes+":"+seconds
}