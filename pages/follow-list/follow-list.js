const { getFollowList, toggleFollow } = require('../../utils/community');
const { showToast } = require('../../utils/util');

Page({
  data: {
    follows: [],
  },

  onShow() {
    this.setData({ follows: getFollowList() });
  },

  goCommunity() {
    wx.switchTab({ url: '/pages/community/community' });
  },

  unfollow(e) {
    const name = e.currentTarget.dataset.name;
    wx.showModal({
      title: '取消关注',
      content: `不再关注「${name}」？`,
      success: (res) => {
        if (!res.confirm) return;
        toggleFollow(name);
        this.setData({ follows: getFollowList() });
        showToast('已取消关注');
      },
    });
  },
});
