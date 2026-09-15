const mock = require('../../services/mock');
const { isMember, promptUpgrade } = require('../../utils/member');
const { callPhone, copyWechat, toggleFavorite, isFavorite, showToast } = require('../../utils/util');

Page({
  data: { item: null, isMember: false, favorited: false },

  onLoad(options) {
    const item = mock.getFactoryById(options.id);
    if (item) {
      this.setData({ item, favorited: isFavorite('factory', item.id) });
      wx.setNavigationBarTitle({ title: item.name });
    }
  },

  onShow() {
    this.setData({ isMember: isMember() });
  },

  callPhone() {
    if (!isMember()) return promptUpgrade();
    callPhone(this.data.item.phone);
  },

  copyWechat() {
    if (!isMember()) return promptUpgrade();
    copyWechat(this.data.item.wechat);
  },

  toggleFav() {
    const favorited = toggleFavorite('factory', this.data.item.id);
    this.setData({ favorited });
    showToast(favorited ? '已收藏' : '已取消');
  },

  leaveMessage() {
    wx.navigateTo({ url: '/pages/messages/messages?action=compose' });
  },

  goMember() {
    wx.navigateTo({ url: '/pages/member/member' });
  }
});
