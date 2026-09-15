const mock = require('../../services/mock');
const { isMember, promptUpgrade } = require('../../utils/member');
const { callPhone, copyWechat } = require('../../utils/util');

Page({
  data: {
    item: null,
    isMember: false
  },

  onLoad(options) {
    const item = mock.getStoreDemandById(options.id);
    if (item) {
      this.setData({ item });
      wx.setNavigationBarTitle({ title: item.title });
    }
  },

  onShow() {
    this.setData({ isMember: isMember() });
  },

  callStore() {
    if (!isMember()) return promptUpgrade('开通会员后可联系门店洽谈供货');
    callPhone(this.data.item.phone);
  },

  copyWechat() {
    if (!isMember()) return promptUpgrade();
    copyWechat(this.data.item.wechat);
  },

  contactStore() {
    if (!isMember()) return promptUpgrade('开通会员后可联系门店');
    wx.showModal({
      title: '联系门店',
      content: `门店：${this.data.item.storeName}\n求购：${this.data.item.title}\n请通过电话或微信沟通供货方案`,
      confirmText: '拨打电话',
      success: (res) => { if (res.confirm) this.callStore(); }
    });
  },

  goMember() {
    wx.navigateTo({ url: '/pages/member/member' });
  }
});
