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
    const skills = skillsData.getSkillsData()
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
   * @param {String} fileID - 云存储文件ID，例如：'cloud://your-env.xxx/background.jpg'
   */
  loadBackgroundImage(fileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/guanning(shu).png') {
    // 如果没有传入 fileID，可以从本地存储读取之前保存的 fileID
    if (!fileID) {
      try {
        const savedFileID = wx.getStorageSync('background_image_fileid')
        if (savedFileID) {
          fileID = savedFileID
        } else {
          // 如果没有保存的 fileID，使用默认值（需要替换为你的实际文件ID）
          fileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/guanning(shu).png'
          console.log('请设置背景图片的云存储文件ID')
          return
        }
      } catch (error) {
        console.error('读取背景图片ID失败:', error)
        return
      }
    }

    // 检查是否支持云开发
    if (!wx.cloud) {
      console.error('当前版本不支持云开发')
      wx.showToast({
        title: '不支持云开发',
        icon: 'none'
      })
      return
    }

    this.setData({
      loadingBackground: true
    })

    // 从云存储下载文件
    wx.cloud.downloadFile({
      fileID: fileID,
      success: (res) => {
        // 下载成功，获取临时文件路径
        const tempFilePath = res.tempFilePath
        this.setData({
          backgroundImage: tempFilePath,
          loadingBackground: false
        })
        // 保存 fileID 到本地存储，下次直接使用
        try {
          wx.setStorageSync('background_image_fileid', fileID)
        } catch (error) {
          console.error('保存背景图片ID失败:', error)
        }
      },
      fail: (err) => {
        console.error('下载背景图片失败:', err)
        this.setData({
          loadingBackground: false
        })
        wx.showToast({
          title: '加载背景失败',
          icon: 'none'
        })
      }
    })
  },

  goBack() {
    wx.navigateBack({
      delta: 1
    })
  }
})
