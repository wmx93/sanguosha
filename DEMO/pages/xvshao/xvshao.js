// pages/xvshao/xvshao.js
const skillsData = require('../../utils/skillsData.js')

Page({
  data: {
    // 三个阶段按钮
    phaseButtons: [
      { id: 'playPhase', text: '出牌阶段', active: true },
      { id: 'finishPhase', text: '结束阶段', active: false },
      { id: 'damagedPhase', text: '受到伤害', active: false }
    ],
    currentPhase: 'playPhase',
    skillButtons: [],
    backgroundImage: ''
  },
  onLoad() {
    this.loadBackgroundImage()
    this.initializeSkills()
  },

  /** 下载背景 */
  loadBackgroundImage() {
    if (!wx.cloud) return
    const fileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/xvshao.png'
    wx.cloud.downloadFile({
      fileID,
      success: res => this.setData({ backgroundImage: res.tempFilePath }),
      fail: err => console.error('许劭背景图下载失败', err)
    })
  },

  /** 根据当前阶段刷新技能按钮 */
  initializeSkills() {
    const all = skillsData.getSkillsByPage('xvshao') || {}
    const pool = all[this.data.currentPhase] || []
    if (!pool.length) {
      this.setData({ skillButtons: [] })
      return
    }
    // 随机抽取 1 项
    const idx = Math.floor(Math.random() * pool.length)
    const skill = pool[idx]
    this.setData({ skillButtons: [{ id: `skill_${Date.now()}`, skill }] })
  },

  /** 阶段按钮点击 */
  onPhaseTap(e) {
    const id = e.currentTarget.dataset.id

    // 允许重复点击同一阶段按钮也重新抽取
    if (id === this.data.currentPhase) {
      this.initializeSkills()
      return
    }

    const phaseButtons = this.data.phaseButtons.map(btn => ({ ...btn, active: btn.id === id }))
    this.setData({ currentPhase: id, phaseButtons }, () => {
      this.initializeSkills()
    })
  },

  onSkillTap(e) {
    const skill = e.currentTarget.dataset.skill
    wx.showModal({ title: '技能详情', content: `${skill.name}: ${skill.description}`, showCancel: false })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})