const mock = require('../../services/mock');

Page({
  data: { tabs: ['产品/方案', '需求大厅'], activeTab: 0, orders: mock.ORDERS, demands: mock.DEMANDS.filter(d => d.type === 'order') },

  switchTab(e) { this.setData({ activeTab: e.currentTarget.dataset.index }); },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/order-detail/order-detail?id=${e.currentTarget.dataset.id}` });
  }
});
