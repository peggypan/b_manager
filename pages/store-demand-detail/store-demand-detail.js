const mock = require('../../services/mock');
const { openChat } = require('../../utils/chat');
const { isMember, promptUpgrade } = require('../../utils/member');
const { callPhone, copyWechat } = require('../../utils/util');

Page({
  data: {
    item: null,
    isMember: false
  },

  onLoad(options) {
    const item = require('../../utils/localPublish').getStoreDemandById(options.id);
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
    const item = this.data.item;
    openChat({
      targetId: `store_demand_${item.id}`,
      targetName: item.storeName,
      targetType: 'store_demand',
      subtitle: item.title,
    });
  },

  goMember() {
    wx.navigateTo({ url: '/pages/member/member' });
  }
});
