Page({
  data: {
    hpMax: 4,
    hpCurrent: 4,
    armor: 0,
    hpSlots: [0, 1, 2, 3],
    judgmentSlots: ['乐不思蜀', '兵粮寸断', '闪电'],
    equipSlots: ['武器', '防具', '+1马', '-1马', '宝物'],
    judgmentActive: [false, false, false],
    equipDisabled: [false, false, false, false, false]
  },

  onLoad() {
    this.refreshHpSlots()
  },

  refreshHpSlots() {
    const hpSlots = Array.from({ length: this.data.hpMax }, (_, i) => i)
    this.setData({ hpSlots })
  },

  toggleJudgment(e) {
    const index = Number(e.currentTarget.dataset.index)
    const next = this.data.judgmentActive.slice()
    next[index] = !next[index]
    this.setData({ judgmentActive: next })
  },

  toggleEquipDisabled(e) {
    const index = Number(e.currentTarget.dataset.index)
    const next = this.data.equipDisabled.slice()
    next[index] = !next[index]
    this.setData({ equipDisabled: next })
  },

  increaseHpMax() {
    const nextMax = Math.min(12, this.data.hpMax + 1)
    if (nextMax === this.data.hpMax) return
    this.setData(
      {
        hpMax: nextMax,
        hpCurrent: Math.min(this.data.hpCurrent + 1, nextMax)
      },
      () => this.refreshHpSlots()
    )
  },

  decreaseHpMax() {
    if (this.data.hpMax <= 1) return
    const nextMax = this.data.hpMax - 1
    this.setData(
      {
        hpMax: nextMax,
        hpCurrent: Math.min(this.data.hpCurrent, nextMax)
      },
      () => this.refreshHpSlots()
    )
  },

  increaseHp() {
    if (this.data.hpCurrent >= this.data.hpMax) return
    this.setData({ hpCurrent: this.data.hpCurrent + 1 })
  },

  decreaseHp() {
    if (this.data.hpCurrent <= 0) return
    this.setData({ hpCurrent: this.data.hpCurrent - 1 })
  },

  increaseArmor() {
    this.setData({ armor: this.data.armor + 1 })
  },

  decreaseArmor() {
    if (this.data.armor <= 0) return
    this.setData({ armor: this.data.armor - 1 })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})