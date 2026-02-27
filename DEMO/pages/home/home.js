Page({
  data: {
    // 预留：后续可以替换为真实图片链接
    banners: [
      {
        title: '限时活动',
        subtitle: '双倍技能经验',
        image: ''
      },
      {
        title: '新手指南',
        subtitle: '快速上手技能系统',
        image: ''
      }
    ],
    searchKeyword: ''
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

  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value || ''
    })
  },

  onSearchConfirm() {
    const keyword = (this.data.searchKeyword || '').trim()

    if (!keyword) {
      wx.showToast({
        title: '请输入武将名称',
        icon: 'none'
      })
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
      wx.showToast({
        title: '未找到对应武将页面',
        icon: 'none'
      })
      return
    }

    wx.navigateTo({
      url: targetUrl
    })
  },

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
  },
  /** 跳转到赵襄页面 */
  goZhaoxiang() {
    wx.navigateTo({ url: '/pages/zhaoxiang/zhaoxiang' })
  },
  /** 跳转到曹金玉页面 */
  goCaoJinYu() {
    wx.navigateTo({ url: '/pages/caojinyu/caojinyu' })
  },
  /** 跳转到神姜维页面 */
  goShenJiangWei() {
    wx.navigateTo({ url: '/pages/shenjiangwei/shenjiangwei' })
  }
})