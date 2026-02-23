// index.js
const skillsData = require('../../utils/skillsData.js')

Page({
  data: {
    skills: [], // 技能列表，从本地存储加载
    currentSkill: null, // 当前抽取到的技能
    showResult: false, // 是否显示结果
    skillsCount: 0, // 技能总数

    gifBackgroundImage: '',
    staticBackgroundImage: '',
    useGifBackground: true, // 是否启用动图背景（用户可切换，持久化）
    loadingBackground: false // 是否正在加载背景图片
  },

  /**
   * 页面加载时初始化数据
   */
  onLoad() {
    // 恢复用户对“动图背景”的选择（默认开启）
    let useGif = true
    try {
      const stored = wx.getStorageSync('index_useGifBackground')
      if (stored !== '' && stored !== null && stored !== undefined) {
        useGif = !!stored
      }
    } catch (e) {
      // ignore
    }
    this.setData({ useGifBackground: useGif })

    this.loadSkills()
    this.loadBackgroundImages()
  },

  /** 切换动图背景开关（并持久化） */
  toggleGifBackground(e) {
    const next = e.detail.value
    this.setData({ useGifBackground: next })
    try {
      wx.setStorageSync('index_useGifBackground', next)
    } catch (err) {
      // ignore
    }
  },

  /**
   * 从本地存储加载技能数据
   */
  loadSkills() {
    // 从关宁分区获取技能
    const skills = skillsData.getSkillsByPage('guangning')
    this.setData({
      skills: skills,
      skillsCount: skills.length
    })
  },

  /**
   * 随机抽取技能
   */
  drawSkill() {
    const { skills } = this.data
    if (skills.length === 0) {
      wx.showToast({
        title: '暂无技能',
        icon: 'none'
      })
      return
    }

    // 随机选择一个技能
    const randomIndex = Math.floor(Math.random() * skills.length)
    const selectedSkill = skills[randomIndex]

    this.setData({
      currentSkill: selectedSkill,
      showResult: true
    })
  },

  /**
   * 重置抽取结果
   */
  reset() {
    this.setData({
      currentSkill: null,
      showResult: false
    })
  },

  /**
   * 从云存储下载背景图片
   */
  /** 下载背景图（动图+静态） */
  loadBackgroundImages() {
    if (!wx.cloud) return

    const gifID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/亢龙归义-关宁-动态.gif'
    const staticID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/guanning(shu).png'

    wx.cloud.downloadFile({
      fileID: gifID,
      success: (res) => this.setData({ gifBackgroundImage: res.tempFilePath }),
      fail: (err) => {
        console.error('index 动图背景下载失败:', err)
        if (!this.data.gifBackgroundImage) {
          this.setData({ gifBackgroundImage: this.data.staticBackgroundImage })
        }
      }
    })

    wx.cloud.downloadFile({
      fileID: staticID,
      success: (res) => this.setData({ staticBackgroundImage: res.tempFilePath }),
      fail: (err) => {
        console.error('index 静态背景下载失败:', err)
      }
    })
  },

  goBack() {
    wx.navigateBack({
      delta: 1
    })
  }
})
