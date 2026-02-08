Page({
  /** 跳转到技能抽取页面 */
  goSkillDraw() {
    wx.navigateTo({ url: '/pages/index/index' })
  },
  /** 跳转到管宁（平均概率） */
  goGuanNing() {
    wx.navigateTo({ url: '/pages/guanning/guanning' })
  },
  /** 跳转到管宁（上线版） */
  goGuanNingOnline() {
    wx.navigateTo({ url: '/pages/guanning_online/guanning_online' })
  },
  /** 跳转到许劭页面 */
  goXvshao() {
    wx.navigateTo({ url: '/pages/xvshao/xvshao' })
  },
  /** 跳转到典韦页面 */
  goDianwei() {
    wx.navigateTo({ url: '/pages/dianwei/dianwei' })
  }
})