//index.js
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
const app = getApp()
const { screenWidth, screenHeight, pixelRatio} = wx.getSystemInfoSync()
Page({
  data: {
    sweethingid: '',
    thing: null,
    stars: [0, 1, 2, 3, 4],
    normalSrc: '',
    selectedSrc: '../../images/selected.svg',
    halfSrc: '../../images/half.svg',
    key: 0,//评分
    sameopenid: false,
    avatarUrl: './user-unlogin.png',
    logoImg: wx.logoImg
  },
  onLoad (options) {
    let that = this
    let sweethingid = options.sweethingid
    this.setData({sweethingid})
  },
  async onShow () {
    try{
      wx.showLoading()
      let ret = await wx.func('seething',{sweethingid: this.data.sweethingid})
      ret.result.data[0].donetime = ret.result.data[0].donetime.split('-').join('.')
      console.log(ret)
      wx.hideLoading()
      let res = await wx.func('sweething',{id: ret.result.data[0].id})
      console.log(res)
      this.setData({
        thing: Object.assign(ret.result.data[0], res.result.data[0]),
        key: ret.result.data[0].happy/2
      })
      let result = await wx.func('login',{})
      this.setData({
        sameopenid: ret.result.data[0].openid == result.result.openid
      })
      this.data.sameopenid?wx.showShareMenu():wx.hideShareMenu()
      let rst = await wx.func('seeperson', {openid: ret.result.data[0].openid})
      rst.result.data.length && this.setData({
        avatarUrl: rst.result.data[0].avatarUrl
      })
    }catch(err){
      console.log(err)
    }
  },
  goToEdit(){
    wx.navigateTo({ url: `../memory/index?id=${this.data.thing.id}` });
  },

  //  //点击右边,半颗星
  //  selectLeft: function (e) {
  //   return
  //   var key = e.currentTarget.dataset.key
  //   if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
  //     //只有一颗星的时候,再次点击,变为0颗
  //     key = 0;
  //   }
  //   console.log("得" + key + "分")
  //   this.setData({
  //     key: key
  //   })
 
  // },
  // //点击左边,整颗星
  // selectRight: function (e) {
  //   return
  //   var key = e.currentTarget.dataset.key
  //   console.log("得" + key + "分")
  //   this.setData({
  //     key: key
  //   })
  // },
  wechatShare(){
    wx.showToast({
      title: '很抱歉，不是该内容用户，不能分享',
      icon: 'none'
    })
  },
  onShareAppMessage(res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    
    return {
      title: 'No.' + this.data.thing.id +' ' + this.data.thing.thing,
      path: 'pages/share/index?sweethingid='+this.data.sweethingid
    }
  },
  wechatzoneShare(){
    if(!this.data.sameopenid){
      this.wechatShare()
      return
    }
    let that = this
    const ctx = wx.createCanvasContext('share-canvas', this)
    const thing = this.data.thing
    wx.showLoading({
      title: '生成图片中',
      mask: true
    })
    new Promise(resolve => {
      wx.getImageInfo({
        src: thing.picaddr || wx.logoImg,
        success: res => {
          console.log(res)
          let picw = res.width
          let pich = res.height
          let w = picw
          let h = pich
          let picL = 0
          let picT = 0
          // picw大取280
          if(picw/pich > screenWidth/280){
            w = pich*screenWidth/280
            picL = (picw - w)/2
          } else {
            h = picw*280/screenWidth
            picT = (pich- h)/2
          }
          console.log(picL, picT, w, h, 0, 0, screenWidth, 280)
          ctx.drawImage(res.path, picL, picT, w, h, 0, 0, screenWidth, 280)
          resolve()
        }
      })
    }).then(() => new Promise(resolve => {
      ctx.beginPath()
      ctx.rect(0, 280, screenWidth, 480)
      ctx.setFillStyle('#fff')
      ctx.fill()

      ctx.beginPath()
      ctx.rect(screenWidth*0.1, 180, screenWidth*0.8, 320)
      ctx.setFillStyle('#ffffff')
      ctx.setShadow(0, 4, 6, 'rgba(43,45,46,.16)')
      ctx.fill()
      ctx.setShadow(0, 0, 0, 'rgba(255,255,255,0)')

      ctx.drawImage('../../images/tag.png', screenWidth*0.9-45, 178, 32, 32)
      ctx.setFontSize(16)
      ctx.setTextAlign('center')
      ctx.setFillStyle('#fff')
      ctx.fillText(thing.id, screenWidth*0.9-30, 200)

      ctx.setFontSize(15)
      // ctx.setFontWeight('blod')
      ctx.setTextAlign('center')
      ctx.setFillStyle('#2b2b2b')
      ctx.fillText(thing.thing, screenWidth / 2, 265)
      // ctx.setFontWeight('normal')

      ctx.beginPath()
      ctx.rect(screenWidth * 0.15, 279, screenWidth * 0.7, 2)
      ctx.setFillStyle('#aaa')
      ctx.fill()

      ctx.beginPath()
      ctx.rect(screenWidth * 0.15, 283, screenWidth * 0.7, 1)
      ctx.setFillStyle('#aaa')
      ctx.fill()

      ctx.setFontSize(10)
      ctx.setTextAlign('center')
      ctx.setFillStyle('#666')
      ctx.fillText(`日期：${thing.donetime}`, screenWidth*0.3, 302)
      ctx.fillText( `地点：${thing.doneaddr[1]}`, screenWidth*0.7, 302)
      
      ctx.setFontSize(14)
      ctx.setTextAlign('center')
      ctx.setFillStyle('#2b2b2b')
      // 多行换行
      let lineWidth = 0
      let lastSubStrIndex = 0
      let initHeight = 360
      let WD = parseInt(ctx.measureText(thing.txt).width/screenWidth * 0.6)/2
      initHeight = initHeight - 18*WD
      for (let i = 0; i < thing.txt.length; i++) {
        lineWidth += ctx.measureText(thing.txt[i]).width
        if (lineWidth > screenWidth * 0.6) {
          ctx.fillText(thing.txt.substring(lastSubStrIndex, i), screenWidth / 2, initHeight)//绘制截取部分
          initHeight += 18//20为字体的高度
          lineWidth = 0
          lastSubStrIndex = i
        }
        if (i == thing.txt.length - 1) {//绘制剩余部分
          ctx.fillText(thing.txt.substring(lastSubStrIndex, i + 1), screenWidth / 2, initHeight);
        }
      }
      
      ctx.beginPath()
      ctx.rect(screenWidth * 0.15, 457, screenWidth * 0.7, 1)
      ctx.setFillStyle('#aaa')
      ctx.fill()

      ctx.beginPath()
      ctx.rect(screenWidth * 0.15, 460, screenWidth * 0.7, 2)
      ctx.setFillStyle('#aaa')
      ctx.fill()

      ctx.setFontSize(15)
      ctx.setTextAlign('left')
      ctx.setFillStyle('#2b2b2b')
      ctx.fillText('幸福感', screenWidth * 0.25, 487)
      let txtW = ctx.measureText('幸福感').width+5+screenWidth * 0.25
      for(let j=0;j < thing.happy/2-1;j++){
        ctx.drawImage('../../images/selected.png', txtW+j*25, 470, 20, 20)
      }
      if(thing.happy%2){
        ctx.drawImage('../../images/half.png', txtW+parseInt(thing.happy/2)*25, 470, 20, 20)
      }

      ctx.drawImage('../../images/gh_38a8dfd54795_430.jpg', screenWidth / 2 - 40, 525, 80, 80)

      ctx.setFontSize(12)
      ctx.setTextAlign('center')
      ctx.setFillStyle('#666')
      ctx.fillText('分享属于 我们的 美好时光', screenWidth / 2, 625)

      ctx.save()
      // ctx.clearRect(0,0,screenWidth, screenHeight)
      ctx.beginPath()
      ctx.arc(screenWidth/2, 215, 30, 0, Math.PI * 2, false);
      ctx.clip()
      wx.getImageInfo({
        src: that.data.avatarUrl,
        success: ret=>{
          ctx.drawImage(ret.path, screenWidth/2-30, 185, 60, 60)
          resolve()
        }
      })
    }).then(()=>{
      ctx.restore()
      ctx.draw()
      setTimeout(() => {
        wx.hideLoading()
        wx.canvasToTempFilePath({
          canvasId: 'share-canvas',
          x: 0,
          y: 0,
          width: screenWidth,
          height: 680,
          // fileType: 'jpg',
          // quality: 1,
          success: res => {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success(res) {
                wx.showToast({
                  title: '生成图片成功',
                  duration: 2000
                })
              }
            })
          },
          fail: () => {
            wx.showToast({
              title: '生成图片失败',
              duration: 2000
            })
          }
        }, this)
      }, 1000)
    }).catch(err=>{
      console.log(err)
    })
  )
  }
})
