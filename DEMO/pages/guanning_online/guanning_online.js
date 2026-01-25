// pages/guanning_online/guanning_online.js
// 独立逻辑：与平均概率版保持 UI 一致，但抽取概率不同
const skillsData = require('../../utils/skillsData.js')

/**
 * 按指定权重随机选取技能
 */
function createWeightedPicker() {
  // 定义各档技能
  const tier2 = ['礼赂', '同礼', '集智', '智迟'] // 2%
  const tier3 = ['仁政', '崇义'] // 3%
  const tier50 = [
    '豪义', '礼让', '礼下', '仁心', '义从', '举义',
    '义舍', '遗礼', '智愚', '遣信', '仁德', '天义'
  ] // 50%

  const allSkills = skillsData.getSkillsByPage('guanning') || []
  const other = allSkills
    .map(s => s.name)
    .filter(name => !tier2.includes(name) && !tier3.includes(name) && !tier50.includes(name))

  // 概率段
  const pickGroup = () => {
    const r = Math.random() * 100 // 0-100
    if (r < 2) return tier2
    if (r < 5) return tier3 // 2~5 ==> 3%
    if (r < 55) return tier50 // 5~55 ==> 50%
    return other // 剩余 45%
  }

  /**
   * 从权重规则中抽一个未出现的技能
   */
  return function (exclude = []) {
    const group = pickGroup()
    // 处理空组
    const pool = group.filter(n => !exclude.includes(n))
    if (pool.length === 0) {
      // 若该组可用技能为空，则随机从全库找未选的
      const fallback = allSkills.map(s => s.name).filter(n => !exclude.includes(n))
      if (fallback.length === 0) return null
      return fallback[Math.floor(Math.random() * fallback.length)]
    }
    return pool[Math.floor(Math.random() * pool.length)]
  }
}

Page({
  data: {
    // 与原页面相同的数据结构
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

  onLoad() {
    this.initializeSkills()
    setTimeout(() => this.loadBackgroundImage(), 200)
  },

  /** 首次随机 3 个技能 */
  initializeSkills() {
    const selected = this.weightedPickUnique(3)
    this.setData({
      skillButtons: selected.map((s, i) => ({ id: `skill_${i}`, skill: s }))
    })
  },

  /** 工具：按权重抽取 count 个不重复技能对象 */
  weightedPickUnique(count) {
    const picker = createWeightedPicker()
    const resultNames = []
    const result = []
    const allMap = new Map(
      (skillsData.getSkillsByPage('guanning') || []).map(s => [s.name, s])
    )
    while (result.length < count) {
      const name = picker(resultNames)
      if (!name) break
      const skillObj = allMap.get(name)
      if (skillObj) {
        result.push(skillObj)
        resultNames.push(name)
      } else {
        break
      }
    }
    return result
  },

  /** 刷新 4 个候选技能 */
  refreshSkillCandidates() {
    const picked = this.weightedPickUnique(4)
    this.setData({
      skillButtons: picked.map((s, i) => ({ id: `skill_cand_${Date.now()}_${i}`, skill: s }))
    })
  },

  shuffle(arr) {
    return arr.slice().sort(() => 0.5 - Math.random())
  },

  /* 以下交互逻辑基本与平均概率版保持一致 */
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

  onSecondaryButtonTap(e) {
    const buttonId = e.currentTarget.dataset.id
    if (buttonId === 'skill') {
      this.refreshSkillCandidates()
      this.setData({ showSkills: true })
      return
    }
    if (buttonId === 'delete') {
      this.onConfirmDelete()
      this.recordSecondaryClick(buttonId)
    } else if (buttonId === 'option2') {
      this.recordSecondaryClick(buttonId)
    }
  },

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

  onConfirmDelete() {
    const { currentClickedButtonId, mainButtons } = this.data
    const filtered = mainButtons.filter(b => b.id !== currentClickedButtonId)
    const newCount = this.data.option2Count + 1
    const secondaryButtons = this.data.secondaryButtons.map(b => b.id === 'option2' ? { ...b, text: `减1点体力上限并摸${newCount}张牌` } : b)
    this.setData({ mainButtons: filtered, option2Count: newCount, secondaryButtons })
  },

  loadBackgroundImage() {
    if (!wx.cloud) return
    const fileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/guanning(wei).png'
    wx.cloud.downloadFile({
      fileID,
      success: res => this.setData({ backgroundImage: res.tempFilePath }),
      fail: err => console.error('背景图下载失败', err)
    })
  },

  goBack() { wx.navigateBack({ delta: 1 }) }
})