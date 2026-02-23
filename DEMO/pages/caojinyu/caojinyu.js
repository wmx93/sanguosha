// pages/caojinyu/caojinyu.js
Page({
  data: {
    gifBackgroundImage: '',
    staticBackgroundImage: '',
    useGifBackground: true, // 是否启用动图背景

    // 撤销栈：记录最近一次变更（可撤销多步）
    history: [],
    historyMax: 30,

    // 曹金玉页面功能数值
    distanceLimit: 0, // 计算与其的距离其不大于
    watchCount: 3,    // 你可以观看牌堆顶的
    handOverLimit: 1, // 将其中至多X张牌交给该角色
    gainLimit: 1,     // 获得其中至多X张牌

    // 标签文本配置
    labels: [
      { id: 'distance', prefix: '计算与其的距离其不大于', key: 'distanceLimit', suffix: '' },
      { id: 'watch', prefix: '你可以观看牌堆顶的', key: 'watchCount', suffix: '张牌' },
      { id: 'handover', prefix: '将其中至多', key: 'handOverLimit', suffix: '张牌交给该角色' },
      { id: 'gain', prefix: '获得其中至多', key: 'gainLimit', suffix: '张牌' }
    ]
  },

  onLoad() {
    // 恢复用户对“动图背景”的选择（默认开启）
    let useGif = true;
    try {
      const stored = wx.getStorageSync('caojinyu_useGifBackground');
      if (stored !== '' && stored !== null && stored !== undefined) {
        useGif = !!stored;
      }
    } catch (e) {}
    this.setData({ useGifBackground: useGif });
    this.loadBackgroundImages();
  },

  /** 切换动图背景开关（并持久化） */
  toggleGifBackground(e) {
    const next = e.detail.value;
    this.setData({ useGifBackground: next });
    try {
      wx.setStorageSync('caojinyu_useGifBackground', next);
    } catch (err) {}
  },

  /** 下载背景图（动图+静态） */
  loadBackgroundImages() {
    if (!wx.cloud) return;

    // 这里填入曹金玉的背景图 FileID
    const gifID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/惊鸿倩影-曹金玉-动态.gif'
    const staticID = 'cloud://cloud1-0g2xp4814f005202.636c-cloud1-0g2xp4814f005202-1387105082/惊鸿倩影-曹金玉-静态.png'

    // 下载动图
    wx.cloud.downloadFile({
      fileID: gifID,
      success: (res) => {
        this.setData({ gifBackgroundImage: res.tempFilePath });
      },
      fail: (err) => {
        console.error('曹金玉动图背景下载失败:', err);
        if (!this.data.gifBackgroundImage) {
          this.setData({ gifBackgroundImage: this.data.staticBackgroundImage });
        }
      }
    });

    // 下载静态图
    wx.cloud.downloadFile({
      fileID: staticID,
      success: (res) => {
        this.setData({ staticBackgroundImage: res.tempFilePath });
      },
      fail: (err) => {
        console.error('曹金玉静态背景下载失败:', err);
      }
    });
  },

  /** 轻触反馈（已禁用全屏震动） */
  triggerTapFeedback() {
    // try {
    //   wx.vibrateShort({ type: 'light' });
    // } catch (e) {
    //   // ignore
    // }
  },

  /** 记录撤销信息（仅记录会被修改的字段） */
  pushHistory(patch) {
    const { history, historyMax } = this.data;
    const entry = {
      ts: Date.now(),
      patch
    };
    const next = [entry, ...(history || [])];
    if (next.length > historyMax) next.length = historyMax;
    this.setData({ history: next });
  },

  /** 撤销上一步 */
  undoLastStep() {
    this.triggerTapFeedback();

    const { history } = this.data;
    if (!history || history.length === 0) {
      wx.showToast({ title: '没有可撤销的操作', icon: 'none', duration: 1200 });
      return;
    }

    wx.showModal({
      title: '确认撤销',
      content: '确定要撤销上一步操作吗？',
      success: (res) => {
        if (res.confirm) {
          const [latest, ...rest] = history;
          this.setData({ ...latest.patch, history: rest });
          wx.showToast({ title: '已撤销', icon: 'success', duration: 800 });
        }
      }
    });
  },

  /** 增加数值：+1 */
  increaseByOne() {
    this.triggerTapFeedback();
    this.showActionSheet(1);
  },

  /** 增加数值：+2 */
  increaseByTwo() {
    this.triggerTapFeedback();
    this.showActionSheet(2);
  },

  /** 弹出选择框让用户选择对哪个标签操作 */
  showActionSheet(delta) {
    const { labels } = this.data;
    const itemList = labels.map(item => `${item.prefix}${this.data[item.key]}${item.suffix}`);

    wx.showActionSheet({
      itemList: itemList,
      success: (res) => {
        if (res.tapIndex !== undefined) {
          const selectedLabel = labels[res.tapIndex];
          this.updateSpecificValue(selectedLabel.key, delta);
        }
      },
      fail: () => {
        console.log('用户取消了选择');
      }
    });
  },

  /** 重置数值 */
  resetValues() {
    this.triggerTapFeedback();
    const { distanceLimit, watchCount, handOverLimit, gainLimit } = this.data;

    wx.showModal({
      title: '确认重置',
      content: '确定要重置所有数值吗？',
      confirmText: '重置',
      confirmColor: '#ff4d4f',
      cancelText: '取消',
      success: (res) => {
        if (!res.confirm) return;

        // 记录重置前的状态
        this.pushHistory({
          distanceLimit,
          watchCount,
          handOverLimit,
          gainLimit
        });

        this.setData({
          distanceLimit: 0,
          watchCount: 3,
          handOverLimit: 1,
          gainLimit: 1
        });

        wx.showToast({
          title: '已重置',
          icon: 'success',
          duration: 1000
        });
      }
    });
  },

  /** 更新特定数值逻辑 */
  updateSpecificValue(key, delta) {
    const currentValue = this.data[key];
    const newValue = Math.min(5, currentValue + delta);
    
    if (currentValue === newValue) {
      wx.showToast({
        title: '已达上限',
        icon: 'none'
      });
      return;
    }

    // 记录修改前的旧值
    this.pushHistory({ [key]: currentValue });

    this.setData({
      [key]: newValue
    });
    
    wx.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 1000
    });
  },

  /** 统一更新数值逻辑 (保留以防其他地方调用，但逻辑已改为特定更新) */
  updateValues(delta) {
    const { distanceLimit, watchCount, handOverLimit, gainLimit } = this.data;
    
    // 逻辑：所有数值增加 delta，但不能超过 5
    this.setData({
      distanceLimit: Math.min(5, distanceLimit + delta),
      watchCount: Math.min(5, watchCount + delta),
      handOverLimit: Math.min(5, handOverLimit + delta),
      gainLimit: Math.min(5, gainLimit + delta)
    });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  }
});
