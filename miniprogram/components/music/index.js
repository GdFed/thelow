const app = getApp()
const bgmList = [
  `cloud://demo-f09591.6465-demo-f09591/AnnaKendrick-Cups.mp3`,
  `cloud://demo-f09591.6465-demo-f09591/MadilynBailey-GalwayGirl.mp3`,
  `cloud://demo-f09591.6465-demo-f09591/TheOffspring-HitThat.mp3`,
  `cloud://demo-f09591.6465-demo-f09591/Tropkillaz-MAMBO.mp3`,
  `cloud://demo-f09591.6465-demo-f09591/ZOOLY-40'z.mp3`
]
let playIndex = Math.round(Math.random()*(bgmList.length-1))
Component({
  externalClasses: [],
  properties: {},
  data: {
    bgmPlay: true,
    bgmTitle: '',
    showMusicStatic: false,
    playMusic:{
      src: bgmList[playIndex],
      title: wx.getTitleBySrc(bgmList[playIndex])
    }
  },
  attached: function () {
    this.bgm = wx.getBackgroundAudioManager()
    this.bgm.src=this.data.playMusic.src
    this.bgm.title=this.data.playMusic.title
    this.bgm.startTime=0
    this.cut()
    this.bgm.onEnded(function(e){
      that.cut()
    })
    this.bgm.onError(function(e){
      console.log(e)
    })
  },
  methods: {
    showMusic(){
      this.setData({
        showMusicStatic: true
      })
    },
    hideMusic(){
      this.setData({
        showMusicStatic: false
      })
    },
    play(){
      let bgmPlay = !this.data.bgmPlay
      bgmPlay?this.bgm.play():this.bgm.pause()
      this.setData({
        bgmPlay: !this.data.bgmPlay
      })
    },
    cut(){
      playIndex = ++playIndex%4
      this.setData({
        playMusic:{
          src: bgmList[playIndex],
          title: wx.getTitleBySrc(bgmList[playIndex])
        },
        bgmPlay: true
      })
      this.bgm.src=this.data.playMusic.src
      this.bgm.title=this.data.playMusic.title
    }
  }
})