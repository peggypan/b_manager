const mock = require('../../services/mock');
const { isMember, promptUpgrade } = require('../../utils/member');
const { callPhone, copyWechat, toggleFavorite, isFavorite, showToast } = require('../../utils/util');

Page({
  data: { item: null, isMember: false, favorited: false },

  onLoad(options) {
    const item = mock.getIndustryOrgById(options.id) || mock.getCompanyById(options.id);
    if (item) {
      this.setData({ item, favorited: isFavorite('company', item.id) });
      wx.setNavigationBarTitle({ title: item.name });
    }
  },

  onShow() { this.setData({ isMember: isMember() }); },

  callPhone() { if (!isMember()) return promptUpgrade(); callPhone(this.data.item.phone); },
  copyWechat() { if (!isMember()) return promptUpgrade(); copyWechat(this.data.item.wechat); },
  goMember() { wx.navigateTo({ url: '/pages/member/member' }); },
  leaveMessage() { wx.navigateTo({ url: '/pages/messages/messages?action=compose' }); },

  toggleFav() {
    const favorited = toggleFavorite('company', this.data.item.id);
    this.setData({ favorited });
    showToast(favorited ? '已收藏' : '已取消');
  }
});
