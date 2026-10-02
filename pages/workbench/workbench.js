/**
 * @page 工作台
 * @router pages/workbench/workbench
 * @description B端企业操作中心：发布管理、消息、收藏、资质等
 */
const { getMembership } = require('../../utils/member');

Page({
  data: {
    membership: {},
    stats: { publish: 0, message: 0, favorite: 0 },
    recentPublish: [],
    tools: [
      { name: '我的发布', icon: '📝', url: '/pages/publish/publish' },
      { name: '企业资质', icon: '🏢', url: '/pages/company/company' },
      { name: '会员中心', icon: '👑', url: '/pages/member/member' },
      { name: '消息中心', icon: '💬', url: '/pages/messages/messages' },
      { name: '我的收藏', icon: '⭐', url: '/pages/favorites/favorites' },
      { name: '服务预约', icon: '📋', url: '/pages/media-book/media-book' }
    ]
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3, showPublish: false });
    }
    this.loadData();
  },

  loadData() {
    const publishList = wx.getStorageSync('myPublish') || [];
    const favorites = wx.getStorageSync('favorites') || [];
    this.setData({
      membership: getMembership(),
      stats: {
        publish: publishList.length,
        message: 2,
        favorite: favorites.length
      },
      recentPublish: publishList.slice(0, 3)
    });
  },

  goTool(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.url });
  },

  goPublish() {
    wx.switchTab({ url: '/pages/publish/publish' });
  }
});
