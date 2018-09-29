Component({
  // externalClasses: ['top-tip'],
  // properties: {
  //   tipsShow: {
  //     type: Boolean
  //   }
  // },
  data: {
    tipsShow: true
  },
  // attached: function () { },
  methods: {
    closeTips: function () { 
      // this.triggerEvent('close', {})
      this.setData({
        tipsShow: false
      })
    },
  }
})