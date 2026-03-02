Page({
  data: {
    gifBackgroundImage: '',
    staticBackgroundImage: '',
    useGifBackground: true,

    suitOptions: ['♠️', '♥️', '♣️', '♦️'],
    slots: [
      { id: 1, suit: '♠️', skillText: '你使用♠️牌无次数限制' },
      { id: 2, suit: '♥️', skillText: '当你使用或打出♥️牌后，摸一张牌' },
      { id: 3, suit: '♣️', skillText: '当你成为♣️牌的目标后，可以弃置一张手牌，令此牌对你无效' },
      { id: 4, suit: '♦️', skillText: '结束阶段，你获得一张♦️牌' }
    ]
  },

  onLoad() {
    let useGif = true
    try {
      const stored = wx.getStorageSync('lukai_useGifBackground')
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
      wx.setStorageSync('lukai_useGifBackground', next)
    } catch (err) {}
  },

  loadBackgroundImages() {
    if (!wx.cloud) return

    const gifFileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/陆凯-经典形象.png'
    const staticFileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/陆凯-经典形象.png'

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

  onSuitChange(e) {
    const index = Number(e.currentTarget.dataset.index)
    const suitIndex = Number(e.detail.value)
    const suitOptions = this.data.suitOptions
    const suit = suitOptions[suitIndex]
    if (!suit && suit !== '') return

    const slots = this.data.slots.map((slot) => ({ ...slot }))
    const target = slots[index]
    if (!target) return

    const duplicatedIndex = slots.findIndex((slot, i) => i !== index && slot.suit === suit)
    if (duplicatedIndex >= 0) {
      const oldSuit = target.suit
      slots[index].suit = suit
      slots[duplicatedIndex].suit = oldSuit
    } else {
      slots[index].suit = suit
    }

    slots.forEach((slot) => {
      if (slot.id === 1) slot.skillText = `你使用${slot.suit}牌无次数限制`
      if (slot.id === 2) slot.skillText = `当你使用或打出${slot.suit}牌后，摸一张牌`
      if (slot.id === 3) slot.skillText = `当你成为${slot.suit}牌的目标后，可以弃置一张手牌，令此牌对你无效`
      if (slot.id === 4) slot.skillText = `结束阶段，你获得一张${slot.suit}牌`
    })

    this.setData({ slots })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})
