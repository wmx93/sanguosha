// app.js
App({
  onLaunch() {
    // 初始化云开发环境
    if (wx.cloud) {
      wx.cloud.init({
        // 你的云开发环境 ID
        env: 'cloud1-0g2xp4814f005202',
        traceUser: true
      })
    }
  }
})