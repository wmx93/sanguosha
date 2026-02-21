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

    // 本次抽取出来的 3 个候选技能（供三选一）
    drawnSkills: [],

    // 本轮已获得的技能（用户从候选中选择 1 个获得，仅用于展示/查看描述）
    obtainedSkills: [],

    // 本局(页面生命周期内)已获得过的技能名，用于后续抽取去重
    obtainedSkillNames: [],

    backgroundImage: '', // 大图
    backgroundPreview: '' // 预览小图
  },
  onLoad() {
    this.loadPreviewBackground()
    this.loadBackgroundImage()
    this.initializeSkills()
  },

  /** 下载预览背景（小图） */
  loadPreviewBackground() {
    if (!wx.cloud) return
    const fileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/xvshaos.jpg'
    wx.cloud.downloadFile({
      fileID,
      success: res => this.setData({ backgroundPreview: res.tempFilePath }),
      fail: err => console.error('许劭预览背景图下载失败', err)
    })
  },

  /** 下载背景（大图） */
  loadBackgroundImage() {
    if (!wx.cloud) return
    const fileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/xvshao3.png'
    wx.cloud.downloadFile({
      fileID,
      success: res => this.setData({ backgroundImage: res.tempFilePath }),
      fail: err => console.error('许劭背景图下载失败', err)
    })
  },

  /** 根据当前阶段抽取 3 个候选技能（供三选一），并清空本轮已获得技能 */
  initializeSkills() {
    const all = skillsData.getSkillsByPage('xvshao') || {}
    const pool = all[this.data.currentPhase] || []

    // 下次抽取技能时清空“本轮已获得”展示，但保留“历史已获得”用于去重
    if (!pool.length) {
      this.setData({ drawnSkills: [], obtainedSkills: [] })
      return
    }

    const obtainedNames = new Set(this.data.obtainedSkillNames || [])
    const filteredPool = pool.filter(s => s && s.name && !obtainedNames.has(s.name))

    const drawn = this.drawRandomSkills(filteredPool, 3)
    this.setData({ drawnSkills: drawn, obtainedSkills: [] })
  },

  /** 从技能池中不重复抽取 count 个（若池子不足则返回全部洗牌后的结果） */
  drawRandomSkills(pool, count) {
    const arr = Array.isArray(pool) ? pool.slice() : []
    // Fisher–Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = arr[i]
      arr[i] = arr[j]
      arr[j] = tmp
    }
    return arr.slice(0, Math.min(count, arr.length))
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

  /** 点击候选技能：三选一获得 */
  onDrawnSkillTap(e) {
    const skill = e.currentTarget.dataset.skill
    if (!skill) return

    // 已经选过则不再重复获得
    if (this.data.obtainedSkills && this.data.obtainedSkills.length) {
      return
    }

    const obtainedSkillNames = this.data.obtainedSkillNames || []
    if (!obtainedSkillNames.includes(skill.name)) {
      obtainedSkillNames.push(skill.name)
    }

    this.setData({ 
      obtainedSkills: [skill], 
      drawnSkills: [],
      obtainedSkillNames
    })
  },

  /** 点击已获得技能：查看描述 */
  onObtainedSkillTap(e) {
    const skill = e.currentTarget.dataset.skill
    if (!skill) return
    wx.showModal({ title: '技能详情', content: `${skill.name}: ${skill.description}`, showCancel: false })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})