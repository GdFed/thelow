// 引入SDK核心类
var QQMapWX = require('./qqmap-wx-jssdk.min.js');
 
// 实例化API核心类
var qqMap = new QQMapWX({
    key: 'ZYQBZ-27RKG-JW6Q6-IWA2I-IJA2S-QKFN4' // 必填
});
export default {
    func(name, data){
        try{
            return wx.cloud.callFunction({name, data})
        }catch(err){
            console.log(err)
        }
    },
    getlocation(){
        // 调用接口
        return new Promise((resolve, reject)=>{
            try {
                wx.getLocation({
                    success: function(res) {
                        console.log(res)
                        let location = {
                            latitude: res.latitude,
                            longitude: res.longitude
                        }
                        qqMap.reverseGeocoder({
                            location,
                            success: function(res) {
                            resolve(res)
                            },
                            fail: function(err) {
                                reject(err)
                            },
                            complete: function(res) {
                                console.log(res)
                            }
                        })
                    }
                })
            } catch(err){
                console.log(err)
            }
        })
        
    }
}