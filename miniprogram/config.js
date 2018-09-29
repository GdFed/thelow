export default {
    getTitleBySrc(src){
        return src.split('/').pop().split('.mp3')[0]
    },
    logoImg: 'cloud://demo-f09591.6465-demo-f09591/love.jpg',
    formatDate (date) {  
        var y = date.getFullYear();  
        var m = date.getMonth() + 1;  
        m = m < 10 ? '0' + m : m;  
        var d = date.getDate();  
        d = d < 10 ? ('0' + d) : d;  
        return y + '-' + m + '-' + d;  
    },
    formatTime (date) {  
        var y = date.getFullYear();  
        var m = date.getMonth() + 1;  
        m = m < 10 ? '0' + m : m;  
        var d = date.getDate();  
        d = d < 10 ? ('0' + d) : d;  
        var h = date.getHours()
        h = h < 10 ? '0' + h : h;
        var min = date.getMinutes()
        min = min < 10 ? '0' + min : min;
        var s = date.getSeconds()
        s = s < 10 ? '0' + s : s;
        return `${y}-${m}-${d} ${h}:${min}:${s}` 
    },
}
