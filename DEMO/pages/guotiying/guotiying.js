Page({
  data: {
    gifBackgroundImage: '',
    staticBackgroundImage: '',
    useGifBackground: true,

    suitOptions: ['♠️', '♥️', '♣️', '♦️'],
    selectedSuit: '',
    pointInput: '',
    selectedCards: [],
    displayedCardRanges: []
  },

  onLoad() {
    let useGif = true
    try {
      const stored = wx.getStorageSync('guotiying_useGifBackground')
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
      wx.setStorageSync('guotiying_useGifBackground', next)
    } catch (err) {}
  },

  loadBackgroundImages() {
    if (!wx.cloud) return

    const fileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/彼岸忘川-郭缇萦-静态.png'

    wx.cloud.downloadFile({
      fileID,
      success: (res) => {
        this.setData({
          gifBackgroundImage: res.tempFilePath,
          staticBackgroundImage: res.tempFilePath
        })
      },
      fail: () => {}
    })
  },

  selectSuit(e) {
    const suit = e.currentTarget.dataset.suit || ''
    this.setData({ selectedSuit: suit })
  },

  onPointInput(e) {
    this.setData({ pointInput: (e.detail.value || '').trim() })
  },

  normalizePoint(pointInput) {
    const raw = String(pointInput || '').trim().toUpperCase()
    if (!raw) return null

    if (raw === 'A') return 1
    if (raw === 'J') return 11
    if (raw === 'Q') return 12
    if (raw === 'K') return 13

    if (/^\d+$/.test(raw)) {
      const num = Number(raw)
      if (num >= 1 && num <= 13) return num
    }

    return null
  },

  buildDisplayedCardRanges(cards) {
    const suitOrder = this.data.suitOptions
    const ranges = []

    suitOrder.forEach((suit) => {
      const points = cards
        .filter((card) => card.suit === suit)
        .map((card) => card.point)
        .sort((a, b) => a - b)

      if (points.length === 0) return

      let start = points[0]
      let end = points[0]

      for (let i = 1; i < points.length; i += 1) {
        const current = points[i]
        if (current === end + 1) {
          end = current
        } else {
          ranges.push(`${suit}${start === end ? start : `${start}-${end}`}`)
          start = current
          end = current
        }
      }

      ranges.push(`${suit}${start === end ? start : `${start}-${end}`}`)
    })

    return ranges
  },

  addCardRecord() {
    const { selectedSuit, pointInput, selectedCards } = this.data

    if (!selectedSuit) {
      wx.showToast({ title: '请先选择花色', icon: 'none' })
      return
    }

    if (!pointInput) {
      wx.showToast({ title: '请输入点数', icon: 'none' })
      return
    }

    const normalizedPoint = this.normalizePoint(pointInput)
    if (normalizedPoint === null) {
      wx.showToast({ title: '点数仅支持A,1-13,J,Q,K', icon: 'none' })
      return
    }

    const duplicated = selectedCards.some((card) => card.suit === selectedSuit && card.point === normalizedPoint)
    if (duplicated) {
      wx.showToast({ title: '该牌已记录', icon: 'none' })
      return
    }

    const nextCards = selectedCards.concat({
      suit: selectedSuit,
      point: normalizedPoint
    })

    this.setData({
      selectedCards: nextCards,
      displayedCardRanges: this.buildDisplayedCardRanges(nextCards),
      pointInput: ''
    })
  },

  clearCardRecords() {
    this.setData({
      selectedCards: [],
      displayedCardRanges: []
    })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})