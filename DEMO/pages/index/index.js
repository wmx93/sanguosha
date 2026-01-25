// index.js
const skillsData = require('../../utils/skillsData.js')

Page({
  data: {
    skills: [], // 技能列表，从本地存储加载
    currentSkill: null, // 当前抽取到的技能
    showResult: false, // 是否显示结果
    skillsCount: 0, // 技能总数
    backgroundImage: '', // 背景图片路径
    loadingBackground: false // 是否正在加载背景图片
  },

  /**
   * 页面加载时初始化数据
   */
  onLoad() {
    this.loadSkills()
    this.loadBackgroundImage()
  },

  /**
   * 从本地存储加载技能数据
   */
  loadSkills() {
    // 从关宁分区获取技能
    const skills = skillsData.getSkillsByPage('guanning')
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
  loadBackgroundImage() {
    if (!wx.cloud) {
      return
    }

    const fileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/guanning(shu).png'

    wx.cloud.downloadFile({
      fileID: fileID,
      success: (res) => {
        this.setData({
          backgroundImage: res.tempFilePath
        })
      },
      fail: (err) => {
        console.error('下载背景图片失败:', err)
      }
    })
  },

  goBack() {
    wx.navigateBack({
      delta: 1
    })
  }
})
