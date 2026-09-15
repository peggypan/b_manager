const mock = require('../../services/mock');
const { isMember, promptUpgrade } = require('../../utils/member');
const { callPhone, copyWechat } = require('../../utils/util');

Page({
  data: {
    item: null,
    isMember: false,
    showProductVideo: false
  },

  onLoad(options) {
    const item = mock.getStoreSupplyById(options.id);
    if (item) {
      this.setData({ item });
      wx.setNavigationBarTitle({ title: item.name });
    }
  },

  onShow() {
    this.setData({ isMember: isMember() });
  },

  previewImage(e) {
    const { url } = e.currentTarget.dataset;
    wx.previewImage({ current: url, urls: this.data.item.images });
  },

  playProductVideo() {
    this.setData({ showProductVideo: true });
  },

  callFactory() {
    if (!isMember()) return promptUpgrade('开通会员后可联系工厂洽谈拿货');
    callPhone(this.data.item.phone);
  },

  copyWechat() {
    if (!isMember()) return promptUpgrade();
    copyWechat(this.data.item.wechat);
  },

  consultDropship() {
    if (!isMember()) return promptUpgrade('开通会员后可咨询一件代发政策');
    wx.showModal({
      title: '咨询一件代发',
      content: `工厂：${this.data.item.factoryName}\n产品：${this.data.item.name}\n请通过电话或微信与工厂沟通代发政策、结算方式`,
      confirmText: '联系工厂',
      success: (res) => { if (res.confirm) this.callFactory(); }
    });
  },

  goMember() {
    wx.navigateTo({ url: '/pages/member/member' });
  },

  goFactory() {
    wx.navigateTo({ url: `/pages/factory-detail/factory-detail?id=${this.data.item.factoryId}` });
  }
});
