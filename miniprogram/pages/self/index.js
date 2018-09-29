//index.js
const app = getApp()

Page({
  data: {
    sweethings: [],
    finish: 0,
    happysum: 0,
    maxhappy: null,
    newhappy: null,
    logoImg: wx.logoImg
  },
  onLoad: function () {
  },
  onShow(){
    // wx.showShareMenu()
    let that = this
    let sweethings = this.data.sweethings
    let finish = this.data.finish
    let happysum = 0
    let maxhappy = 0
    let newhappy = this.data.newhappy
    wx.func('seething', {}).then(ret=>{
      let max = -1
      let newtime = -1
      sweethings = ret.result.data
      sweethings.forEach(item=>{
        finish++
        happysum += item.happy
        if(item.happy > max){
          max = item.happy
          maxhappy = item
          maxhappy.donetime = item.donetime.split('-').join('.')
        }
        if(item.timestamp > newtime){
          newtime = item.timestamp
          newhappy = item
          newhappy.donetime = item.donetime.split('-').join('.')
        }
      })
      that.setData({sweethings, finish, happysum, maxhappy, newhappy})
      wx.func('sweething',{id: newhappy.id}).then(res=>{
        this.setData({newhappy: Object.assign(res.result.data[0], that.data.newhappy)})
      }).catch(err=>{
        console.log(err)
      })
    }).catch(err=>{
      console.log(err)
    })
  },
  switchPage(){
    if(this.data.maxhappy){
      wx.navigateTo({ url: '../share/index?sweethingid='+this.data.maxhappy._id });
    }else{
      wx.reLaunch({ url: '../index/index' });
    }
  },
  goToNew(){
    wx.navigateTo({ url: '../share/index?sweethingid='+this.data.newhappy._id })
  },
  goToIndex(){
    wx.navigateBack()
  }
})
