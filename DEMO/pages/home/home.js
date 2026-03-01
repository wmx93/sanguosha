Page({
  data: {
    banners: [
      { title: '限时活动', subtitle: '双倍技能经验', image: '' },
      { title: '新手指南', subtitle: '快速上手技能系统', image: '' }
    ],
    searchKeyword: '',
    showAllGenerals: false,
    displayedEntries: [],
    quickEntries: [
      { name: '关宁', icon: '/assets/icons/guangning.png', action: 'goSkillDraw' },
      { name: '管宁', icon: '/assets/icons/guanning.png', action: 'goGuanNing' },
      { name: '管宁线上版', icon: '/assets/icons/guanning.png', action: 'goGuanNingOnline' },
      { name: '许劭', icon: '/assets/icons/xvshao.png', action: 'goXvshao' },
      { name: '神典韦', icon: '/assets/icons/dianwei.png', action: 'goDianwei' },
      { name: '赵襄', icon: '/assets/icons/zhaoxiang.png', action: 'goZhaoxiang' },
      { name: '曹金玉', icon: '/assets/icons/caojinyu.png', action: 'goCaoJinYu' },
      { name: '神姜维', icon: '/assets/icons/shenjiangwei.png', action: 'goShenJiangWei' }
    ]
  },

  searchRouteMap: {
    关宁: '/pages/index/index',
    guanning: '/pages/index/index',
    管宁: '/pages/guanning/guanning',
    管宁线上版: '/pages/guanning_online/guanning_online',
    线上管宁: '/pages/guanning_online/guanning_online',
    许劭: '/pages/xvshao/xvshao',
    xushao: '/pages/xvshao/xvshao',
    神典韦: '/pages/dianwei/dianwei',
    典韦: '/pages/dianwei/dianwei',
    dianwei: '/pages/dianwei/dianwei',
    赵襄: '/pages/zhaoxiang/zhaoxiang',
    zhaoxiang: '/pages/zhaoxiang/zhaoxiang',
    曹金玉: '/pages/caojinyu/caojinyu',
    caojinyu: '/pages/caojinyu/caojinyu',
    神姜维: '/pages/shenjiangwei/shenjiangwei',
    姜维: '/pages/shenjiangwei/shenjiangwei',
    shenjiangwei: '/pages/shenjiangwei/shenjiangwei',
    jiangwei: '/pages/shenjiangwei/shenjiangwei'
  },

  onLoad() {
    this.updateDisplayedEntries()
  },

  updateDisplayedEntries() {
    const { quickEntries, showAllGenerals } = this.data
    this.setData({
      displayedEntries: showAllGenerals ? quickEntries : quickEntries.slice(0, 8)
    })
  },

  toggleAllGenerals() {
    this.setData({
      showAllGenerals: !this.data.showAllGenerals
    }, () => {
      this.updateDisplayedEntries()
    })
  },

  onEntryTap(e) {
    const action = e.currentTarget.dataset.action
    if (action && typeof this[action] === 'function') {
      this[action]()
    }
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value || '' })
  },

  onSearchConfirm() {
    const keyword = (this.data.searchKeyword || '').trim()
    if (!keyword) {
      wx.showToast({ title: '请输入武将名称', icon: 'none' })
      return
    }

    const normalized = keyword.toLowerCase().replace(/\s+/g, '')
    const directMatch = this.searchRouteMap[keyword]
    const normalizedMatch = this.searchRouteMap[normalized]
    const partialMatchKey = Object.keys(this.searchRouteMap).find((name) => {
      const key = String(name)
      return key.includes(keyword) || key.toLowerCase().includes(normalized)
    })

    const targetUrl = directMatch || normalizedMatch || (partialMatchKey ? this.searchRouteMap[partialMatchKey] : '')

    if (!targetUrl) {
      wx.showToast({ title: '未找到对应武将页面', icon: 'none' })
      return
    }

    wx.navigateTo({ url: targetUrl })
  },

  goSkillDraw() { wx.navigateTo({ url: '/pages/index/index' }) },
  goGuanNing() { wx.navigateTo({ url: '/pages/guanning/guanning' }) },
  goGuanNingOnline() { wx.navigateTo({ url: '/pages/guanning_online/guanning_online' }) },
  goXvshao() { wx.navigateTo({ url: '/pages/xvshao/xvshao' }) },
  goDianwei() { wx.navigateTo({ url: '/pages/dianwei/dianwei' }) },
  goZhaoxiang() { wx.navigateTo({ url: '/pages/zhaoxiang/zhaoxiang' }) },
  goCaoJinYu() { wx.navigateTo({ url: '/pages/caojinyu/caojinyu' }) },
  goShenJiangWei() { wx.navigateTo({ url: '/pages/shenjiangwei/shenjiangwei' }) },

  goCardTracker() {
    wx.navigateTo({ url: '/pages/card_tracker/card_tracker' })
  },

  goHpTracker() {
    wx.navigateTo({ url: '/pages/hp_tracker/hp_tracker' })
  }
})