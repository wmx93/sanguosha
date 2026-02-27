// pages/shenjiangwei/shenjiangwei.js
Page({
  data: {
    gifBackgroundImage: '',
    staticBackgroundImage: '',
    useGifBackground: true,

    // 天任标记数量
    tianrenCount: 0,

    // 第二个功能：牌名点击标记（点击变色）
    cardMarks: [
      '杀', '闪', '桃', '酒', '桃园结义', '万箭齐发', '五谷丰登', '无中生有',
      '过河拆桥', '顺手牵羊', '决斗', '借刀杀人', '南蛮入侵', '乐不思蜀', '兵粮寸断',
      '无懈可击', '闪电', '火攻', '铁索连环', '诸葛连弩', '雌雄双股剑', '寒冰剑',
      '青釭剑', '古锭刀', '丈八蛇矛', '青龙偃月刀', '贯石斧', '方天画戟', '麒麟弓',
      '朱雀羽扇', '八卦阵', '仁王盾', '藤甲', '白银狮子', '赤兔', '绝影', '爪黄飞电',
      '大宛', '的卢', '紫骍', '骅骝'
    ].map((name) => ({ name, used: false }))
  },

  onLoad() {
    let useGif = true
    try {
      const stored = wx.getStorageSync('shenjiangwei_useGifBackground')
      if (stored !== '' && stored !== null && stored !== undefined) {
        useGif = !!stored
      }
    } catch (e) {}

    this.setData({ useGifBackground: useGif })
    this.loadBackgroundImages()
  },

  toggleGifBackground(e) {
    const next = e.detail.value
    this.setData({ useGifBackground: next })
    try {
      wx.setStorageSync('shenjiangwei_useGifBackground', next)
    } catch (err) {}
  },

  /** 增加天任标记 */
  increaseTianren() {
    this.setData({
      tianrenCount: this.data.tianrenCount + 1
    })
  },

  /** 减少天任标记 */
  decreaseTianren() {
    if (this.data.tianrenCount > 0) {
      this.setData({
        tianrenCount: this.data.tianrenCount - 1
      })
    }
  },

  /** 清空天任标记 */
  resetTianren() {
    if (this.data.tianrenCount === 0) return
    wx.showModal({
      title: '提示',
      content: '确定要清空“天任”标记吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ tianrenCount: 0 })
        }
      }
    })
  },

  /** 点击牌名切换已使用状态 */
  toggleCardMark(e) {
    const index = e.currentTarget.dataset.index
    const cardMarks = this.data.cardMarks.slice()
    if (!cardMarks[index]) return
    cardMarks[index].used = !cardMarks[index].used
    this.setData({ cardMarks })
  },

  /** 重置所有牌名标记 */
  resetCardMarks() {
    const cardMarks = this.data.cardMarks.map((item) => ({ ...item, used: false }))
    this.setData({ cardMarks })
    wx.showToast({ title: '已重置牌名标记', icon: 'none' })
  },

  loadBackgroundImages() {
    if (!wx.cloud) return

    const gifID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/炽剑补天-神姜维-动态.gif'
    const staticID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/炽剑补天-神姜维-静态.png'

    wx.cloud.downloadFile({
      fileID: gifID,
      success: (res) => this.setData({ gifBackgroundImage: res.tempFilePath }),
      fail: () => {}
    })

    wx.cloud.downloadFile({
      fileID: staticID,
      success: (res) => this.setData({ staticBackgroundImage: res.tempFilePath }),
      fail: () => {}
    })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})