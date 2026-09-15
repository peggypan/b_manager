const mock = require('../../services/mock');
const { getMembership } = require('../../utils/member');
const { openJoinMenu } = require('../../utils/joinMenu');

Page({
  data: {
    banners: mock.BANNERS,
    modules: mock.MODULES,
    membership: {},
    hotDemands: mock.DEMANDS.slice(0, 3)
  },

  onLoad() {
    this.setData({ modules: mock.MODULES });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0, showPublish: false });
    }
    this.setData({ membership: getMembership() });
  },

  goSearch() {
    wx.navigateTo({ url: '/pages/search/search' });
  },

  goModule(e) {
    const { url, action } = e.currentTarget.dataset;
    if (action === 'join') {
      openJoinMenu();
      return;
    }
    wx.navigateTo({ url });
  },

  goMember() {
    wx.navigateTo({ url: '/pages/member/member' });
  },

  goDemand(e) {
    const item = this.data.hotDemands[e.currentTarget.dataset.index];
    wx.setStorageSync('marketKeyword', item.title);
    wx.switchTab({ url: '/pages/market/market' });
  }
});
