const localPublish = require('../../utils/localPublish');
const { openChat } = require('../../utils/chat');
const { isMember, promptUpgrade } = require('../../utils/member');
const { callPhone, copyWechat } = require('../../utils/util');

Page({
  data: { item: null, isMember: false },

  onLoad(options) {
    const item = localPublish.getProjectById(options.id);
    if (item) { this.setData({ item }); wx.setNavigationBarTitle({ title: item.name }); }
  },

  onShow() { this.setData({ isMember: isMember() }); },

  callPhone() { if (!isMember()) return promptUpgrade(); callPhone(this.data.item.phone); },
  copyWechat() { if (!isMember()) return promptUpgrade(); copyWechat(this.data.item.wechat); },
  goMember() { wx.navigateTo({ url: '/pages/member/member' }); },
  leaveMessage() {
    const item = this.data.item;
    if (!item) return;
    openChat({
      targetId: `invest_${item.id}`,
      targetName: item.name,
      targetType: 'invest',
      subtitle: item.track,
    });
  },
});
