//index.js
const app = getApp()
Page({
  data: {
    editStatus: true,
    thing: null,
    happy: 0,
    txt: '',
    time: wx.formatDate(new Date()),
    photos: '',
    wallshow: false,
    region: ['广东省', '深圳市', '南山区'],
    sweethingid: 0,
    openid: ''
  },
  onLoad (options) {
    let id = parseInt(options.id)
    wx.func('sweething',{id}).then(ret=>{
      this.setData({thing: ret.result.data[0]})
    }).catch(err=>{
      console.log(err)
    })
    wx.func('login',{}).then(res=>{
      this.setData({
        openid: res.result.openid
      })
    }).catch(err=>{
      console.log(err)
    })
      
  },
  onShow: function () {
    // wx.showShareMenu()
    let that = this
    wx.getlocation().then(ret=>{
      let addr = ret.result.address_component
      that.setData({
        region: [addr.province, addr.city, addr.district]
      })
    }).catch(err=>{
      console.log(err)
    })
  },
  bindTimeChange(e){
    // console.log('bindTimeChange',e)
    this.setData({
      time: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    // console.log('bindRegionChange',e)
    this.setData({
      region: e.detail.value
    })
  },
  switchChange(e){
    // console.log('switchChange',e)
    this.setData({
      wallshow: e.detail.value
    })
  },
  sliderChange(e){
    // console.log('sliderChange',e)
    this.setData({
      happy: e.detail.value
    })
  },
  textareaBlur(e){
    // console.log('textareaBlur',e)
    this.setData({
      txt: e.detail.value
    })
  },
  addPic(){
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      sourceType: ['album', 'camera'],
      success (res) {
        if(res.tempFiles[0].size > 2097152){
          wx.showToast({
            title: '上传图片不能大于2M', //提示的内容,
            icon: 'none', //图标
          });
          return
        }
        const tempFilePath = res.tempFilePaths[0]
        that.setData({
          photos: tempFilePath
        })
      }
    })
  },
  delPic(e){
    this.setData({
      photos: ''
    })
  },
  editAll() {
    this.setData({
      editStatus: true
    })
  },
  save() {
    let that = this
    this.setData({
      editStatus: false
    })
    let time = this.data.time.split('-')
    time = `${time[0]}年${time[1]}月${time[2]}日`
    let addr = this.data.region[1]
    addr = addr.substring(0, addr.length-1)
    let thing = this.data.thing.thing
    let txt = `${time}，那天我们在${addr}，${thing}。`
    if(this.data.photos){
      // 上传图片
      const cloudPath = 'img/' + wx.openid+'TO'+ this.data.thing.id+'TIME'+(+new Date())+'TIME' + '.jpg'
      wx.cloud.uploadFile({
        cloudPath,
        filePath: this.data.photos, // 小程序临时文件路径
      }).then(realpath=>{
        wx.func('savething',{
          id: this.data.thing.id,
          donetime: this.data.time,
          doneaddr: this.data.region,
          happy:  this.data.happy,
          txt:  this.data.txt || txt,
          wallshow: this.data.wallshow,
          picaddr: realpath.fileID
        }).then(ret=>{
          console.log(ret)
          that.setData({sweethingid: ret.result._id})
        }).catch(err=>{
          console.log(err)
        })
      }).catch(err=>{
        console.log(err)
      })
    }else{
      wx.func('savething',{
        id: this.data.thing.id,
        donetime: this.data.time,
        doneaddr: this.data.region,
        happy:  this.data.happy,
        txt:  this.data.txt || txt,
        wallshow: this.data.wallshow,
        picaddr: ''
      }).then(ret=>{
        that.setData({sweethingid: ret.result._id})
        console.log(ret)
      }).catch(err=>{
        console.log(err)
      })
    }
  },
  share(){
    wx.navigateTo({ url: `../share/index?sweethingid=${this.data.sweethingid}` });
  },
  formSubmit(e){
    console.log(e)
    let that = this
    setTimeout(()=>{
      wx.func('sendmsg', {
        templateid: '9uHCLq3DZ-kZWnTZfAf8UL9zv2IuSdwzqhQyDLuAUcw',
        formid: e.detail.formId,
        openid: that.data.openid,
        page: `pages/share/index?sweethingid=${that.data.sweethingid}`,
        formdata: {
          keyword1: {
              value: `${that.data.thing.thing}`
              // value: `No.${that.data.thing.id} ${that.data.thing.thing}`
          },
          keyword2: {
              value: wx.formatTime(new Date())
          },
          keyword3: {
              value: that.data.time
          } ,
          keyword4: {
              value: '恭喜您完成一份愿望，赶紧分享让TA也知道吧~'
          }
      }
      })
    }, 2000)
  }
})
