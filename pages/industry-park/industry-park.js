const mock = require('../../services/mock');
const localPublish = require('../../utils/localPublish');

Page({
  data: {
    parks: [],
    associations: [],
  },

  onShow() {
    this.setData({
      parks: localPublish.getDirectoryListByFilter('宠物产业园'),
      associations: localPublish.getDirectoryListByFilter('宠物商协会'),
    });
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/directory-detail/directory-detail?id=${e.currentTarget.dataset.id}` });
  },

  goApply() {
    wx.navigateTo({ url: '/pages/industry-apply/industry-apply' });
  },
});
