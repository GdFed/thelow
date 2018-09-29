//app.js
import api from './apis/index'
import conf from './config'
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init()
    }
    this.globalData = {}
    Object.assign(wx, conf, api)

    try{
      if(!wx.openid){
        wx.func('login',{}).then(ret=>{
          wx.openid = ret.result.openid
        }).catch(err=>{
          console.log(err)
        })
      }
    }catch(err){
      console.log(err)
    }
  }
})
