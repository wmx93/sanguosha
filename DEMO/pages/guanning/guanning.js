// pages/guanning/guanning.js
const skillsData = require('../../utils/skillsData.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 主要按钮（杀、闪、桃、酒）
    mainButtons: [
      { id: 'sha', text: '杀', clicked: false, clickCount: 0 },
      { id: 'shan', text: '闪', clicked: false, clickCount: 0 },
      { id: 'tao', text: '桃', clicked: false, clickCount: 0 },
      { id: 'jiu', text: '酒', clicked: false, clickCount: 0 }
    ],

    // 第二次点击后显示的三个按钮（暂时使用占位符）
    secondaryButtons: [
      { id: 'skill', text: '选择技能' },
      { id: 'option2', text: '选项二' },
      { id: 'delete', text: '删除按钮' }
    ],

    // 技能按钮（从技能库中选择三个技能）
    skillButtons: [],

    // 当前点击的按钮ID
    currentClickedButtonId: null,

    // UI状态控制
    showSecondaryButtons: false,
    showSkills: false,
    showDeleteConfirm: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initializeSkills()
  },

  /**
   * 初始化技能数据
   */
  initializeSkills() {
    // 从关宁分区获取技能
    const guanningSkills = skillsData.getSkillsByPage('guanning')

    let selectedSkills = []

    if (guanningSkills.length >= 3) {
      // 如果关宁分区有3个或更多技能，从中随机选择3个
      const shuffled = guanningSkills.sort(() => 0.5 - Math.random())
      selectedSkills = shuffled.slice(0, 3)
    } else if (guanningSkills.length > 0) {
      // 如果关宁分区有技能但不足3个，使用所有关宁技能
      selectedSkills = guanningSkills
    } else {
      // 如果关宁分区没有技能，显示提示
      wx.showToast({
        title: '暂无技能数据',
        icon: 'none'
      })
      selectedSkills = []
    }

    const skillButtons = selectedSkills.map((skill, index) => ({
      id: `skill_${index}`,
      skill: skill
    }))

    this.setData({
      skillButtons: skillButtons
    })
  },

  /**
   * 主要按钮点击事件
   */
  onMainButtonTap(e) {
    const buttonId = e.currentTarget.dataset.id
    const mainButtons = this.data.mainButtons
    const buttonIndex = mainButtons.findIndex(btn => btn.id === buttonId)

    if (buttonIndex === -1) return

    const button = mainButtons[buttonIndex]
    button.clickCount += 1

    if (button.clickCount === 1) {
      // 第一次点击：变色
      button.clicked = true
      this.setData({
        mainButtons: mainButtons,
        currentClickedButtonId: buttonId
      })
    } else if (button.clickCount === 2) {
      // 第二次点击：显示三个新按钮
      this.setData({
        showSecondaryButtons: true,
        showSkills: false,
        currentClickedButtonId: buttonId
      })
    }
  },

  /**
   * 第二个按钮组点击事件
   */
  onSecondaryButtonTap(e) {
    const buttonId = e.currentTarget.dataset.id

    if (buttonId === 'skill') {
      // 点击第一个按钮：显示技能选择
      this.setData({
        showSkills: true
      })
    } else if (buttonId === 'delete') {
      // 点击第三个按钮：显示删除确认
      this.setData({
        showDeleteConfirm: true
      })
    } else if (buttonId === 'option2') {
      // 点击第二个按钮的处理（暂时占位）
      wx.showToast({
        title: '选项二功能待开发',
        icon: 'none'
      })
    }
  },

  /**
   * 技能按钮点击事件
   */
  onSkillButtonTap(e) {
    const skill = e.currentTarget.dataset.skill
    wx.showModal({
      title: '技能详情',
      content: `${skill.name}: ${skill.description}`,
      showCancel: false
    })
  },

  /**
   * 取消删除
   */
  onCancelDelete() {
    this.setData({
      showDeleteConfirm: false
    })
  },

  /**
   * 确认删除
   */
  onConfirmDelete() {
    const currentClickedButtonId = this.data.currentClickedButtonId
    const mainButtons = this.data.mainButtons

    // 删除当前点击过的按钮
    const filteredButtons = mainButtons.filter(btn => btn.id !== currentClickedButtonId)

    this.setData({
      mainButtons: filteredButtons,
      showSecondaryButtons: false,
      showSkills: false,
      showDeleteConfirm: false,
      currentClickedButtonId: null
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})