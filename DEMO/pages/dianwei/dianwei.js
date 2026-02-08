// pages/dianwei/dianwei.js
const skillsData = require('../../utils/skillsData.js')

Page({
  data: {
    backgroundImage: '',
    backgroundPreview: '',
    allGenerals: [],        // 技能库中的 5 个武将（从大库随机抽出的可选池）
    selectedIndices: [],    // 用户选中的武将索引列表 (最多2个)
    selectedGenerals: [],   // 确认选中的 2 个武将
    candidateSkills: [],    // 选定武将的技能列表（武将+技能名+描述）
    acquiredSkills: [],     // 已获得的技能
    isConfirmed: false      // 是否已确认选择
  },

  onLoad() {
    this.loadPreviewBackground()
    this.loadBackgroundImage()
    this.initDianweiSkills()
  },

  // 初始化：从大库中随机抽 5 个武将作为本轮可选池
  initDianweiSkills() {
    const all = skillsData.getSkillsByPage('dianwei') || []
    if (!all.length) {
      this.setData({
        allGenerals: [],
        selectedIndices: [],
        selectedGenerals: [],
        candidateSkills: [],
        acquiredSkills: [],
        isConfirmed: false,
        previewGeneralName: '',
        previewSkills: []
      })
      return
    }

    // 若库中武将数量大于5，则本轮随机抽5个作为可选池
    const pool = all.slice()
    pool.sort(() => 0.5 - Math.random())
    const displayGenerals = pool.slice(0, Math.min(5, pool.length))

    this.setData({
      allGenerals: displayGenerals.map(g => ({ ...g, selected: false })),
      selectedIndices: [],
      selectedGenerals: [],
      candidateSkills: [],
      acquiredSkills: [],
      isConfirmed: false,
      previewGeneralName: '',
      previewSkills: []
    })
  },

  // 点击武将进行选择 / 取消选择（点击时在页面展示该武将技能，取消时不弹不更新展示）
  onGeneralTap(e) {
    if (this.data.isConfirmed) return
    const index = e.currentTarget.dataset.index
    let { selectedIndices, allGenerals } = this.data

    const idxInSelected = selectedIndices.indexOf(index)
    const isUnselect = idxInSelected > -1

    if (isUnselect) {
      // 取消选中
      selectedIndices.splice(idxInSelected, 1)
      allGenerals[index].selected = false
      this.setData({ selectedIndices, allGenerals })
      return
    }

    // 选中 (限制 2 个)
    if (selectedIndices.length >= 2) {
      wx.showToast({ title: '最多只能选两个', icon: 'none' })
      return
    }
    selectedIndices.push(index)
    allGenerals[index].selected = true

    const g = allGenerals[index]
    const skills = (g && g.skills) ? g.skills : []
    const previewSkills = skills.map(s => ({
      general: g.general,
      name: s.name,
      description: s.description
    }))

    this.setData({
      selectedIndices,
      allGenerals,
      previewGeneralName: g.general,
      previewSkills
    })
  },

  // 确认选择两个武将，生成候选技能
  onConfirmSelection() {
    const { selectedIndices, allGenerals } = this.data
    if (selectedIndices.length !== 2) {
      wx.showToast({ title: '请选择两个武将', icon: 'none' })
      return
    }

    const selectedGenerals = selectedIndices.map(i => allGenerals[i])
    const candidateSkills = []
    selectedGenerals.forEach(g => {
      ;(g.skills || []).forEach(s => {
        candidateSkills.push({
          general: g.general,
          name: s.name,
          description: s.description
        })
      })
    })

    this.setData({
      selectedGenerals,
      candidateSkills,
      isConfirmed: true
    })
  },

  // 重置选择：重新随机抽 5 个武将，清空已获得技能
  onResetTap() {
    this.initDianweiSkills()
  },

  // 点击技能：获得 + 弹详情
  onSkillTap(e) {
    const skill = e.currentTarget.dataset.skill
    if (!skill) return

    const list = this.data.acquiredSkills.slice()
    const exists = list.some(s => s.general === skill.general && s.name === skill.name)
    if (!exists) {
      list.push(skill)
      this.setData({ acquiredSkills: list })
    }

    wx.showModal({
      title: `${skill.general}·${skill.name}`,
      content: skill.description || '',
      showCancel: false
    })
  },

  /** 下载预览背景（小图） */
  loadPreviewBackground() {
    if (!wx.cloud) return
    const fileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/dianweis.jpg'
    wx.cloud.downloadFile({
      fileID,
      success: res => this.setData({ backgroundPreview: res.tempFilePath }),
      fail: err => console.error('典韦预览背景图下载失败', err)
    })
  },

  /** 下载背景（大图） */
  loadBackgroundImage() {
    if (!wx.cloud) return
    const fileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/dianwei.png'
    wx.cloud.downloadFile({
      fileID,
      success: res => this.setData({ backgroundImage: res.tempFilePath }),
      fail: err => console.error('典韦背景图下载失败', err)
    })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})