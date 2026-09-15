const mock = require('../../services/mock');

Page({
  data: {
    parks: mock.INDUSTRY_PARKS,
    associations: mock.ASSOCIATIONS
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/directory-detail/directory-detail?id=${e.currentTarget.dataset.id}` });
  },

  goApply() {
    wx.navigateTo({ url: '/pages/industry-apply/industry-apply' });
  }
});
