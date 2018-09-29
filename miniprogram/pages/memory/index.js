//index.js
Page({
  data: {
    editStatus: false,
    thing: null,
    happy: 0,
    txt: '',
    time: wx.formatDate(new Date()),
    photos: [],
    wallshow: false,
    region: ['广东省', '深圳市', '南山区'],
    sweethingid: '',
    openid: ''
  },
  onLoad (options) {
    let that = this
    let id = parseInt(options.id)
    wx.func('sweething',{id}).then(ret=>{
      // console.log(ret)
      this.setData({thing: ret.result.data[0]})
    }).catch(err=>{
      console.log(err)
    })
    wx.showLoading()
    wx.func('seething', {id}).then(ret=>{
      wx.hideLoading()
      console.log(ret)
      ret = ret.result.data[0]
      that.setData({
        happy: ret.happy,
        txt: ret.txt,
        time: ret.donetime,
        wallshow: ret.wallshow || false,
        region: ret.doneaddr,
        photos: ret.picaddr,
        sweethingid: ret._id
      })
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
        // 上传图片
        const cloudPath = 'img/' + wx.openid+'TO'+ that.data.thing.id +'TIME'+(+new Date())+'TIME' + '.jpg'
        wx.cloud.uploadFile({
          cloudPath,
          filePath: tempFilePath, // 小程序临时文件路径
        }).then(realpath=>{
          console.log(realpath)
          wx.func('updatething',{
            id: that.data.thing.id,
            picaddr: realpath.fileID
          }).then(ret=>{
            console.log(ret)
          }).catch(err=>{
            console.log(err)
          })
        }).catch(err=>{
          console.log(err)
        })
      }
    })
  },
  delPic(e){
    wx.cloud.deleteFile({
      fileList: [this.data.photos]
    }).then(res => {
      console.log(res.fileList)
    }).catch(err => {
      wx.showToast({
        title: err,
        icon: 'none'
      })
    })
    this.setData({
      photos: ''
    })
    wx.func('updatething',{
      id: this.data.thing.id,
      picaddr: ''
    }).then(ret=>{
      console.log(ret)
    }).catch(err=>{
      console.log(err)
    })
  },
  editAll() {
    this.setData({
      editStatus: true
    })
  },
  save() {
    this.setData({
      editStatus: false
    })
    let time = this.data.time.split('-')
    time = `${time[0]}年${time[1]}月${time[2]}日`
    let addr = this.data.region[1]
    addr = addr.substring(0, addr.length-1)
    let thing = this.data.thing.thing
    let txt = `${time}那天，我们在${addr}，${thing}。`
    wx.func('updatething',{
      id: this.data.thing.id,
      donetime: this.data.time,
      doneaddr: this.data.region,
      happy:  this.data.happy,
      txt:  this.data.txt || txt,
      wallshow: this.data.wallshow
    }).then(ret=>{
      console.log(ret)
    }).catch(err=>{
      console.log(err)
    })
  },
  shareShow(){
    wx.navigateTo({ url: `../share/index?sweethingid=${this.data.sweethingid}` });
    this.setData({
      shareShowStatus: true
    })
  },
  formSubmit(e){
    let that = this
    setTimeout(()=>{
      wx.func('sendmsg', {
        templateid: 'Zl2Z4T4UewIiDKKCzYZi0lBWIZKtADVa70M9L1qjMFE',
        formid: e.detail.formId,
        openid: that.data.openid,
        page: `pages/share/index?sweethingid=${that.data.sweethingid}`,
        formdata: {
          keyword1: {
              value: `${that.data.thing.thing}`
          },
          keyword2: {
              value: wx.formatTime(new Date())
          },
          keyword3: {
              value: '您修改了愿望，您的TA还不知道吧，赶紧分享这份幸福哟~'
          }
        }
      }).then(res=>{
        console.log(res)
      })
    }, 2000)
  }
})
