// pages/zhaoxiang/zhaoxiang.js
const skillsData = require('../../utils/skillsData.js')

Page({
  data: {
    backgroundImage: '',

    // 梅影标记数量
    meiyingCount: 0,

    // 扶汉功能相关
    showFuhanModal: false,
    selectGeneralCount: 4, // 至少4
    fuhanResults: [],
    reservedSkills: [] // 已保留的技能（最多2个）
  },

  onLoad() {
    this.loadBackgroundImage()
  },

  /** 增加梅影标记 */
  increaseMeiying() {
    this.setData({
      meiyingCount: this.data.meiyingCount + 1
    })
  },

  /** 减少梅影标记 */
  decreaseMeiying() {
    if (this.data.meiyingCount > 0) {
      this.setData({
        meiyingCount: this.data.meiyingCount - 1
      })
    }
  },

  /** 清空梅影标记 */
  resetMeiying() {
    if (this.data.meiyingCount === 0) return
    wx.showModal({
      title: '提示',
      content: '确定要清空“梅影”标记吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ meiyingCount: 0 })
        }
      }
    })
  },

  // ---------------- 扶汉 ----------------

  /** 打开扶汉选择弹窗 */
  openFuhanModal() {
    this.setData({
      showFuhanModal: true,
      selectGeneralCount: Math.max(4, this.data.selectGeneralCount || 4)
    })
  },

  /** 关闭扶汉选择弹窗 */
  closeFuhanModal() {
    this.setData({ showFuhanModal: false })
  },

  increaseSelectCount() {
    this.setData({ selectGeneralCount: (this.data.selectGeneralCount || 4) + 1 })
  },

  decreaseSelectCount() {
    const next = (this.data.selectGeneralCount || 4) - 1
    this.setData({ selectGeneralCount: Math.max(4, next) })
  },

  /** 确认并抽取扶汉武将（清空旧结果和已保留技能） */
  confirmFuhan() {
    const count = Math.max(4, this.data.selectGeneralCount || 4)
    const pool = skillsData.getSkillsByPage('zhaoxiang') || []

    if (!Array.isArray(pool) || pool.length === 0) {
      wx.showToast({ title: '扶汉技能库为空', icon: 'none' })
      this.closeFuhanModal()
      return
    }

    const selected = this.drawRandomItems(pool, count)
    this.setData({
      fuhanResults: selected,
      reservedSkills: [], // 重新抽取时清空已保留
      showFuhanModal: false
    })
  },

  resetFuhan() {
    this.setData({ fuhanResults: [], reservedSkills: [] })
  },

  /** 点击技能名：先看描述，确认选择后保留（最多2个） */
  onFuhanSkillTap(e) {
    const skill = e.currentTarget.dataset.skill
    const general = e.currentTarget.dataset.general
    if (!skill) return

    const reserved = this.data.reservedSkills || []
    const isReserved = reserved.some(s => s.name === skill.name)

    if (isReserved) {
      wx.showModal({
        title: skill.name,
        content: (skill.description || '暂无描述') + (general ? `\n\n（来自武将：${general}）` : '') + '\n\n（该技能已保留）',
        showCancel: false
      })
      return
    }

    if (reserved.length >= 2) {
      wx.showModal({
        title: skill.name,
        content: (skill.description || '暂无描述') + (general ? `\n\n（来自武将：${general}）` : ''),
        showCancel: false
      })
      return
    }

    wx.showModal({
      title: skill.name,
      content: (skill.description || '暂无描述') + (general ? `\n\n（来自武将：${general}）` : ''),
      confirmText: '确认选择',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          const newReserved = [...reserved, { ...skill, generalName: general }]
          const nextData = { reservedSkills: newReserved }
          // 选满2个技能后，隐藏/取消展示本次抽取的技能列表
          if (newReserved.length >= 2) {
            nextData.fuhanResults = []
          }
          this.setData(nextData)
          wx.showToast({ title: '已保留', icon: 'success' })
        }
      }
    })
  },

  /** 点击已保留技能：查看描述 */
  onReservedSkillTap(e) {
    const skill = e.currentTarget.dataset.skill
    if (!skill) return
    wx.showModal({
      title: skill.name || '技能',
      content: (skill.description || '暂无描述') + (skill.generalName ? `\n\n（来自武将：${skill.generalName}）` : ''),
      showCancel: false
    })
  },

  /** 用于 catchtap 阻止弹窗冒泡 */
  noop() {},


  drawRandomItems(arr, count) {
    const copy = Array.isArray(arr) ? arr.slice() : []
    // Fisher–Yates shuffle
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = copy[i]
      copy[i] = copy[j]
      copy[j] = tmp
    }
    return copy.slice(0, Math.min(count, copy.length))
  },

  /** 使用 wx.cloud.downloadFile 下载背景图 */
  loadBackgroundImage() {
    if (!wx.cloud) return

    const fileID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/月痕芳影-赵襄-动态.gif'

    wx.cloud.downloadFile({
      fileID,
      success: (res) => {
        this.setData({ backgroundImage: res.tempFilePath })
      },
      fail: (err) => {
        console.error('赵襄背景图下载失败', err)
      }
    })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})
