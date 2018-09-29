//index.js

import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    logged: false,
    things: [],
    done: [],
    limit: 0,
    skip: 0,
    bottomStatus: false
  },

  onLoad: function() {
    let that = this
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      wx.func('addperson',{person: e.detail.userInfo}).then(ret=>{
        console.log(ret)
      }).catch(err=>{
        console.log(err)
      })
    }
    if(e.detail.userInfo){
      wx.navigateTo({ url: '../self/index' });
    }
  },
  async onShow () {
    
    wx.showShareMenu()
    try {
      let ret = await wx.func('seething', {})
      console.log(ret)
      this.setData({done: ret.result.data})
      let res = await wx.func('sweethings', {limit: 40, skip: 0})
      console.log(res)
      let things = res.result.data
      this.data.done.forEach(item=>{
        things.forEach(thing=>{
          if(item.id == thing.id){
            Object.assign(thing, item)
            thing.done = true
          }
        })
      })
      this.setData({things, limit: 20, skip: 40})
    }catch(err){
      console.log(err)
    }
  },
  async onReachBottom(){
    try{
      let limit = this.data.limit
      let skip = this.data.skip
      if(skip >= 100){
          this.setData({
            bottomStatus: true
          })
          return
      }
      let res = await wx.func('sweethings', {limit, skip})
      console.log(res)
      let things = res.result.data
      this.data.done.forEach(item=>{
        things.forEach(thing=>{
          if(item.id == thing.id){
            Object.assign(thing, item)
            thing.done = true
          }
        })
      })
      skip += limit
      this.setData({things: this.data.things.concat(things),skip})
    }catch(err){
      console.log(err)
    }
  },
  goThing(e){
    let index = e.currentTarget.dataset.index
    let things = this.data.things
    let id = things[index].id
    let sweethingid = things[index]._id
    if(things[index].done){
      wx.navigateTo({ url: `../share/index?sweethingid=${sweethingid}` });
    }else{
      wx.navigateTo({ url: `../doing/index?id=${id}` });
    }
  },
  onShareAppMessage(res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '和你的100个愿望清单'
    }
  },
  formSubmit(e){
    console.log(e)
    // wx.func('saveformid',{formid: e.detail.formId}).then(res=>{
    //   console.log(res)
    // })
  }

})
