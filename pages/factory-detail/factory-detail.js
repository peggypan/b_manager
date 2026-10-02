const localPublish = require('../../utils/localPublish');
const { openChat } = require('../../utils/chat');
const { isMember, promptUpgrade } = require('../../utils/member');
const { callPhone, copyWechat, toggleFavorite, isFavorite, showToast } = require('../../utils/util');

Page({
  data: { item: null, isMember: false, favorited: false },

  onLoad(options) {
    const item = localPublish.getFactoryById(options.id);
    if (item) {
      const bizTypes = item.bizTypes || [];
      this.setData({
        item: { ...item, bizTypes },
        bizTypesText: bizTypes.join('、') || '—',
        favorited: isFavorite('factory', item.id),
      });
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
    const item = this.data.item;
    if (!item) return;
    openChat({
      targetId: `factory_${item.id}`,
      targetName: item.name,
      targetType: 'factory',
      subtitle: `${item.category} · ${item.region}`,
    });
  },

  goMember() {
    wx.navigateTo({ url: '/pages/member/member' });
  }
});
