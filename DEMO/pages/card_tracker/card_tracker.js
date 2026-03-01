Page({
  data: {
    records: {},
    collapsedSections: {},
    sections: [
      {
        category: '基本牌',
        items: [
          { name: '杀', points: ['♥️10','♥️10','♥️J','♦️6','♦️7','♦️8','♦️9','♦️10','♦️K','♣️2','♣️3','♣️4','♣️5','♣️6','♣️7','♣️8','♣️8','♣️9','♣️9','♣️10','♣️10','♣️J','♣️J','♠️8','♠️8','♠️9','♠️9','♠️10','♠️10'] },
          { name: '火杀', points: ['♥️4', '♥️7', '♥️10', '♦️4', '♦️5'] },
          { name: '雷杀', points: ['♣️5', '♣️6', '♣️7', '♣️8', '♠️4', '♠️5', '♠️6', '♠️7', '♠️8'] },
          { name: '闪', points: ['♥️2', '♥️2', '♥️8', '♥️9', '♥️J', '♥️Q', '♥️K', '♦️2', '♦️2', '♦️3', '♦️4', '♦️5', '♦️6', '♦️6', '♦️7', '♦️7', '♦️8', '♦️8', '♦️9', '♦️10', '♦️10', '♦️J', '♦️J', '♦️J'] },
          { name: '桃', points: ['♥️3', '♥️4', '♥️5', '♥️6', '♥️6', '♥️7', '♥️8', '♥️9', '♥️Q', '♦️2', '♦️3', '♦️Q'] },
          { name: '酒', points: ['♦️9', '♣️3', '♣️9', '♠️3', '♠️9'] }
        ]
      },
      {
        category: '锦囊牌',
        items: [
          { name: '桃园结义', points: ['♥️A'] },
          { name: '万箭齐发', points: ['♥️A'] },
          { name: '五谷丰登', points: ['♥️3', '♥️4'] },
          { name: '无中生有', points: ['♥️7', '♥️8', '♥️9', '♥️J'] },
          { name: '过河拆桥', points: ['♥️Q', '♣️3', '♣️4', '♠️3', '♠️4', '♠️Q'] },
          { name: '顺手牵羊', points: ['♦️3', '♦️4', '♠️3', '♠️4', '♠️J'] },
          { name: '决斗', points: ['♦️A', '♣️A', '♠️A'] },
          { name: '借刀杀人', points: ['♣️Q', '♣️K'] },
          { name: '南蛮入侵', points: ['♣️7', '♠️7', '♠️K'] },
          { name: '乐不思蜀', points: ['♥️6', '♣️6', '♠️6'] },
          { name: '兵粮寸断', points: ['♣️4', '♠️10'] },
          { name: '无懈可击', points: ['♥️A', '♥️K', '♦️Q', '♣️Q', '♣️K', '♠️J', '♠️K'] },
          { name: '闪电', points: ['♥️Q', '♠️A'] },
          { name: '火攻', points: ['♥️2', '♥️3', '♦️Q'] },
          { name: '铁索连环', points: ['♣️10', '♣️J', '♣️Q', '♣️K', '♠️J', '♠️Q'] }
        ]
      },
      {
        category: '装备牌-武器',
        items: [
          { name: '诸葛连弩', points: ['♦️A', '♣️A'] },
          { name: '雌雄双股剑', points: ['♠️2'] },
          { name: '寒冰剑', points: ['♠️2'] },
          { name: '青釭剑', points: ['♠️6'] },
          { name: '古锭刀', points: ['♠️A'] },
          { name: '丈八蛇矛', points: ['♠️Q'] },
          { name: '青龙偃月刀', points: ['♠️5'] },
          { name: '贯石斧', points: ['♦️5'] },
          { name: '方天画戟', points: ['♦️Q'] },
          { name: '麒麟弓', points: ['♥️5'] },
          { name: '朱雀羽扇', points: ['♦️A'] }
        ]
      },
      {
        category: '装备牌-防具',
        items: [
          { name: '八卦阵', points: ['♠️2', '♣️2'] },
          { name: '仁王盾', points: ['♣️2'] },
          { name: '藤甲', points: ['♣️2', '♠2'] },
          { name: '白银狮子', points: ['♣️A'] }
        ]
      },
      {
        category: '装备牌-坐骑',
        items: [
          { name: '赤兔', points: ['♥️5'] },
          { name: '绝影', points: ['♠️5'] },
          { name: '爪黄飞电', points: ['♥️K'] },
          { name: '大宛', points: ['♠️K'] },
          { name: '的卢', points: ['♣️5'] },
          { name: '紫骍', points: ['♦️K'] },
          { name: '骅骝', points: ['♦️K'] }
        ]
      }
    ]
  },

  onLoad() {
    this.restoreLocalState()
  },

  restoreLocalState() {
    try {
      const records = wx.getStorageSync('card_tracker_records') || {}
      const collapsedSections = wx.getStorageSync('card_tracker_collapsed_sections') || {}
      this.setData({ records, collapsedSections })
    } catch (e) {
      this.setData({ records: {}, collapsedSections: {} })
    }
  },

  saveLocalState() {
    try {
      wx.setStorageSync('card_tracker_records', this.data.records || {})
      wx.setStorageSync('card_tracker_collapsed_sections', this.data.collapsedSections || {})
    } catch (e) {}
  },

  toggleSection(e) {
    const category = e.currentTarget.dataset.category
    if (!category) return

    const collapsedSections = { ...this.data.collapsedSections }
    collapsedSections[category] = !collapsedSections[category]

    this.setData({ collapsedSections }, () => {
      this.saveLocalState()
    })
  },

  togglePoint(e) {
    const key = e.currentTarget.dataset.key
    const records = { ...this.data.records }
    records[key] = !records[key]
    this.setData({ records }, () => {
      this.saveLocalState()
    })
  },

  resetAll() {
    this.setData({ records: {} }, () => {
      this.saveLocalState()
    })
    wx.showToast({ title: '已清空记录', icon: 'none' })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})