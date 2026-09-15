/**
 * 宠投投 - 宠业资源撮合小程序
 * @description 核心商业模式：企业会员费，免费用户仅看简介，会员解锁联系方式
 */
App({
  globalData: {
    userInfo: null,
    company: null
  },

  onLaunch() {
    this.initStorage();
  },

  initStorage() {
    try {
      const membership = wx.getStorageSync('membership');
      const company = wx.getStorageSync('company');
      if (company) this.globalData.company = company;
      if (!membership) {
        wx.setStorageSync('membership', { level: 'free', active: false, expireDate: '' });
      }
    } catch (e) {
      console.error('初始化失败', e);
    }
  }
});
