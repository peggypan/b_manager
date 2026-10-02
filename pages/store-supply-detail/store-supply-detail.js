const mock = require('../../services/mock');
const { openChat } = require('../../utils/chat');
const { isMember, promptUpgrade } = require('../../utils/member');
const { callPhone, copyWechat } = require('../../utils/util');

Page({
  data: {
    item: null,
    isMember: false,
    showProductVideo: false
  },

  onLoad(options) {
    const item = require('../../utils/localPublish').getStoreSupplyById(options.id);
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
    const item = this.data.item;
    openChat({
      targetId: `store_supply_${item.id}`,
      targetName: item.factoryName,
      targetType: 'store_supply',
      subtitle: `代发咨询 · ${item.name}`,
    });
  },

  goMember() {
    wx.navigateTo({ url: '/pages/member/member' });
  },

  goFactory() {
    wx.navigateTo({ url: `/pages/factory-detail/factory-detail?id=${this.data.item.factoryId}` });
  }
});
