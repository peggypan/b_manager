const localPublish = require('../../utils/localPublish');
const { openChat } = require('../../utils/chat');
const { isMember, promptUpgrade } = require('../../utils/member');
const { callPhone, copyWechat } = require('../../utils/util');

const DEMAND_TYPE_NAMES = {
  factory: '找工厂',
  order: '找订单',
  influencer: '达人合作',
};

Page({
  data: {
    item: null,
    isMember: false,
    viewMode: 'order',
    typeName: '',
    hasMedia: false,
  },

  onLoad(options) {
    const kind = options.kind || 'order';
    if (kind === 'demand') {
      const item = localPublish.getDemandById(options.id);
      if (!item) {
        wx.showToast({ title: '需求不存在', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 800);
        return;
      }
      const images = item.images || [];
      this.setData({
        item,
        viewMode: 'demand',
        typeName: DEMAND_TYPE_NAMES[item.type] || '需求',
        hasMedia: images.length > 0 || !!item.videoUrl,
      });
      wx.setNavigationBarTitle({ title: '需求详情' });
      return;
    }

    const item = localPublish.getOrderById(options.id);
    if (item) {
      this.setData({ item, viewMode: 'order' });
      wx.setNavigationBarTitle({ title: item.title });
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

  goMember() {
    wx.navigateTo({ url: '/pages/member/member' });
  },

  leaveMessage() {
    const item = this.data.item;
    if (!item) return;
    openChat({
      targetId: `order_${item.id}`,
      targetName: item.factoryName || item.title,
      targetType: 'order',
      subtitle: item.title,
    });
  },

  startChat() {
    if (!isMember()) return promptUpgrade();
    const { item } = this.data;
    openChat({
      targetId: `demand_${item.id}`,
      targetName: item.company || item.title,
      targetType: 'demand',
      subtitle: item.title,
    });
  },
});
