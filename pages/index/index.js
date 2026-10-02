const mock = require('../../services/mock');
const localPublish = require('../../utils/localPublish');
const { getMembership } = require('../../utils/member');
const { openJoinMenu } = require('../../utils/joinMenu');

function demandSortKey(d) {
  if (d.time) {
    const parsed = Date.parse(String(d.time).replace(/\./g, '-'));
    if (!Number.isNaN(parsed)) return parsed;
  }
  return Number(d.id) || 0;
}

Page({
  data: {
    banners: mock.BANNERS,
    modules: mock.MODULES,
    membership: {},
    hotDemands: [],
  },

  onLoad() {
    this.setData({ modules: mock.MODULES });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0, showPublish: false });
    }
    const hotDemands = [...localPublish.getMergedDemands()]
      .sort((a, b) => demandSortKey(b) - demandSortKey(a))
      .slice(0, 3);
    this.setData({ membership: getMembership(), hotDemands });
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
    if (!item) return;
    wx.navigateTo({ url: `/pages/order-detail/order-detail?kind=demand&id=${item.id}` });
  },
});
