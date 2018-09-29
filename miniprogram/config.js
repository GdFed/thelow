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
    // sendMsg(params){
    //     wx.request({
    //         url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx58f984ee339d8d54&secret=1de7409a53b7ba2e2540ad21844c424f`,
    //         success(ret){
    //           let data = {
    //             touser: params.openid,
    //             template_id: params.templateid,
    //             page: params.page,
    //             form_id: params.formid,
    //             data: params.formdata,
    //             emphasis_keyword: 'keyword1.DATA'
    //           }
    //           wx.request({
    //               url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${ret.data.access_token}`,
    //               method: "POST",
    //               header: {
    //                   "content-type": "application/json",
    //               },
    //               data,
    //               success(res){
    //                 console.log(res)
    //               }
    //           }) 
    //         }
    //       })
    // }
}