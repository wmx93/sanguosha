Page({
  data: {
    gifBackgroundImage: '',
    staticBackgroundImage: '',
    useGifBackground: true,

    suitOptions: ['♥️', '♦️', '♣️', '♠️'],
    records: [],
    resultText: '',
    nonResponsiveSuits: [],
    nonResponsiveSuitText: ''
  },

  onLoad() {
    let useGif = true
    try {
      const stored = wx.getStorageSync('zhangqiying_useGifBackground')
      if (stored !== '' && stored !== null && stored !== undefined) {
        useGif = !!stored
      }
    } catch (e) {}

    this.setData({ useGifBackground: useGif })
    this.loadBackgroundImages()
  },

  toggleGifBackground(e) {
    const next = !!(e && e.detail ? e.detail.value : !this.data.useGifBackground)
    this.setData({ useGifBackground: next })
    try {
      wx.setStorageSync('zhangqiying_useGifBackground', next)
    } catch (err) {}
  },

  loadBackgroundImages() {
    if (!wx.cloud) return

    const gifFileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/九州春回-张琪瑛-动态.gif'
    const staticFileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/九州春回-张琪瑛-静态.png'

    wx.cloud.downloadFile({
      fileID: gifFileID,
      success: (res) => {
        this.setData({ gifBackgroundImage: res.tempFilePath })
      },
      fail: () => {}
    })

    wx.cloud.downloadFile({
      fileID: staticFileID,
      success: (res) => {
        this.setData({ staticBackgroundImage: res.tempFilePath })
      },
      fail: () => {}
    })
  },

  addSuitRecord(e) {
    const suit = e.currentTarget.dataset.suit || ''
    if (!suit) return

    const { records, nonResponsiveSuits } = this.data
    const baseRecords = records.length >= 3 ? records.slice(1) : records
    const nextRecords = baseRecords.concat(suit)

    if (nextRecords.length === 3) {
      const uniqueCount = new Set(nextRecords).size
      const isThreeSame = uniqueCount === 1
      const isThreeDifferent = uniqueCount === 3

      if (isThreeSame) {
        const nextNonResponsiveSuits = nonResponsiveSuits.includes(suit)
          ? nonResponsiveSuits
          : nonResponsiveSuits.concat(suit)

        this.setData({
          records: [],
          resultText: '摸三张牌',
          nonResponsiveSuits: nextNonResponsiveSuits,
          nonResponsiveSuitText: `不可响应的花色：${nextNonResponsiveSuits.join('、')}`
        })
        return
      }

      if (isThreeDifferent) {
        this.setData({
          records: [],
          resultText: '令一名角色回复一点体力或失去一点体力',
          nonResponsiveSuitText: nonResponsiveSuits.length
            ? `不可响应的花色：${nonResponsiveSuits.join('、')}`
            : ''
        })
        return
      }
    }

    this.setData({
      records: nextRecords,
      resultText: '',
      nonResponsiveSuitText: nonResponsiveSuits.length
        ? `不可响应的花色：${nonResponsiveSuits.join('、')}`
        : ''
    })
  },

  clearRecords() {
    this.setData({
      records: [],
      resultText: '',
      nonResponsiveSuits: [],
      nonResponsiveSuitText: ''
    })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})
