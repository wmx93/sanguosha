// pages/guanning/guanning.js
const skillsData = require('../../utils/skillsData.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    mainButtons: [
      { id: 'sha', text: '杀', clicked: false, clickCount: 0 },
      { id: 'shan', text: '闪', clicked: false, clickCount: 0 },
      { id: 'tao', text: '桃', clicked: false, clickCount: 0 },
      { id: 'jiu', text: '酒', clicked: false, clickCount: 0 }
    ],
    secondaryButtons: [
      { id: 'skill', text: '防止此伤害，选择1个技能令其获得' },
      { id: 'option2', text: '减1点体力上限并摸0张牌' },
      { id: 'delete', text: '删除你本次视为使用的牌名' }
    ],
    skillButtons: [],
    acquiredSkills: [],
    currentClickedButtonId: null,
    showSecondaryButtons: false,
    showSkills: false,
    clickedSecondaryButtons: [],
    backgroundImage: '',
    option2Count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.initializeSkills() // 保持原有逻辑
    setTimeout(() => this.loadBackgroundImage(), 200)
  },

  /**
   * 初始随机 3 个技能
   */
  initializeSkills() {
    const all = skillsData.getSkillsByPage('guanning') || []
    const selected = this.shuffle(all).slice(0, Math.min(3, all.length))
    this.setData({
      skillButtons: selected.map((s, i) => ({ id: `skill_${i}`, skill: s }))
    })
  },

  /**
   * 工具：打乱数组
   */
  shuffle(arr) {
    return arr.slice().sort(() => 0.5 - Math.random())
  },

  /**
   * 刷新 4 个候选技能（点击新按钮时）
   */
  refreshSkillCandidates() {
    const lib = skillsData.getSkillsByPage('guanning') || []
    const picked = this.shuffle(lib).slice(0, Math.min(4, lib.length))
    this.setData({
      skillButtons: picked.map((s, i) => ({ id: `skill_cand_${Date.now()}_${i}`, skill: s }))
    })
  },

  /** 主要按钮点击 */
  onMainButtonTap(e) {
    const buttonId = e.currentTarget.dataset.id
    const mainButtons = this.data.mainButtons
    const idx = mainButtons.findIndex(b => b.id === buttonId)
    if (idx === -1) return

    const btn = mainButtons[idx]
    btn.clickCount += 1

    if (btn.clickCount === 1) {
      btn.clicked = true
      this.setData({ mainButtons, currentClickedButtonId: buttonId })
    } else if (btn.clickCount === 2) {
      const secondaryButtons = this.data.secondaryButtons.map(b => b.id === 'option2' ? { ...b, text: `减1点体力上限并摸${this.data.option2Count}张牌` } : b)
      this.setData({
        showSecondaryButtons: true,
        showSkills: false,
        secondaryButtons,
        currentClickedButtonId: buttonId,
        clickedSecondaryButtons: []
      })
    }
  },

  /** 新按钮点击 */
  onSecondaryButtonTap(e) {
    const buttonId = e.currentTarget.dataset.id
    if (buttonId === 'skill') {
      // 每次打开重新抽 4 项
      this.refreshSkillCandidates()
      this.setData({ showSkills: true })
      return // 不计入点击，等实际选技能后
    }
    if (buttonId === 'delete') {
      this.onConfirmDelete()
      this.recordSecondaryClick(buttonId)
    } else if (buttonId === 'option2') {
      this.recordSecondaryClick(buttonId)
    }
  },

  /** 技能按钮点击 */
  onSkillButtonTap(e) {
    const skill = e.currentTarget.dataset.skill
    const { acquiredSkills } = this.data
    if (!acquiredSkills.some(s => s.name === skill.name)) {
      acquiredSkills.push(skill)
      this.setData({ acquiredSkills, showSkills: false })
    }
    wx.showModal({ title: '技能详情', content: `${skill.name}: ${skill.description}`, showCancel: false })
    this.recordSecondaryClick('skill')
  },

  onAcquiredSkillTap(e) {
    const skill = e.currentTarget.dataset.skill
    wx.showModal({ title: '技能详情', content: `${skill.name}: ${skill.description}`, showCancel: false })
  },

  /** 记录新按钮点击 */
  recordSecondaryClick(btnId) {
    const arr = this.data.clickedSecondaryButtons
    if (!arr.includes(btnId)) arr.push(btnId)
    if (arr.length >= 2 && this.data.showSecondaryButtons) {
      const mainButtons = this.data.mainButtons.map(b => b.id === this.data.currentClickedButtonId ? { ...b, clicked: false, clickCount: 0 } : b)
      this.setData({ showSecondaryButtons: false, showSkills: false, clickedSecondaryButtons: [], mainButtons })
    } else {
      this.setData({ clickedSecondaryButtons: arr })
    }
  },

  /** 删除 */
  onConfirmDelete() {
    const { currentClickedButtonId, mainButtons } = this.data
    const filtered = mainButtons.filter(b => b.id !== currentClickedButtonId)
    const newCount = this.data.option2Count + 1
    const secondaryButtons = this.data.secondaryButtons.map(b => b.id === 'option2' ? { ...b, text: `减1点体力上限并摸${newCount}张牌` } : b)
    this.setData({ mainButtons: filtered, option2Count: newCount, secondaryButtons })
  },

  /** 增强版背景图加载函数 */
  loadBackgroundImage() {
    // 1. 检查云能力是否可用
    if (!wx.cloud) {
      console.error('当前微信版本不支持云开发能力，请更新微信客户端')
      return
    }

    const fileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/guanning(wei).png'

    wx.cloud.downloadFile({
      fileID: fileID,
      success: res => {
        if (res.tempFilePath) {
          this.setData({ backgroundImage: res.tempFilePath })
          console.log('背景图下载成功', res.tempFilePath)
        } else {
          console.error('下载成功但返回的临时文件路径为空', res)
        }
      },
      fail: err => {
        console.error('背景图下载失败', err)
        // 常见错误码提示
        if (err.errCode === -403003) {
          console.error('错误原因：云存储返回了空的下载链接，请检查fileID是否正确、文件是否存在且有权限')
        } else if (err.errCode === -1) {
          console.error('错误原因：网络请求失败，请检查网络连接')
        }
      }
    })
  },
  goBack() { wx.navigateBack({ delta: 1 }) }
}) 