const { getMembership, getPublishLimit, promptUpgrade } = require('../../utils/member');
const { showToast } = require('../../utils/util');

Page({
  data: {
    tabs: ['全部', '工厂需求', '产品/订单', '投资项目'],
    activeTab: 0,
    publishList: [],
    publishLimit: 0,
    publishUsed: 0,
    membership: {}
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const publishList = wx.getStorageSync('myPublish') || [];
    const membership = getMembership();
    const limit = getPublishLimit();
    this.setData({
      publishList,
      membership,
      publishLimit: limit,
      publishUsed: publishList.length
    });
    this.filterList();
  },

  filterList() {
    const types = ['', 'factory', 'order', 'invest'];
    const type = types[this.data.activeTab];
    const all = wx.getStorageSync('myPublish') || [];
    const publishList = type ? all.filter(p => p.type === type) : all;
    this.setData({ publishList });
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.index });
    this.filterList();
  },

  goPublish(e) {
    const type = e.currentTarget.dataset.type;
    const { publishLimit, publishUsed, membership } = this.data;

    if (type === 'directory') {
      wx.navigateTo({ url: '/pages/directory-apply/directory-apply' });
      return;
    }

    if (!membership.active) {
      promptUpgrade('免费用户无法发布供需信息，开通会员即可发布');
      return;
    }
    if (publishLimit >= 0 && publishUsed >= publishLimit) {
      showToast(`当前会员最多发布${publishLimit}条，请升级会员`);
      return;
    }

    const routes = {
      factory: '/pages/factory-publish/factory-publish',
      order: '/pages/publish-edit/publish-edit?type=order',
      invest: '/pages/invest-publish/invest-publish',
      directory: '/pages/directory-apply/directory-apply'
    };
    wx.navigateTo({ url: routes[type] });
  },

  editItem(e) {
    const item = this.data.publishList[e.currentTarget.dataset.index];
    wx.navigateTo({ url: `/pages/publish-edit/publish-edit?id=${item.id}&type=${item.type}` });
  },

  removeItem(e) {
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '确认下架',
      content: '下架后其他用户将无法看到此信息',
      success: (res) => {
        if (res.confirm) {
          const list = wx.getStorageSync('myPublish') || [];
          list.splice(index, 1);
          wx.setStorageSync('myPublish', list);
          this.loadData();
          showToast('已下架');
        }
      }
    });
  }
});
