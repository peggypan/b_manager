const mock = require('../../services/mock');

Page({
  data: {
    tabs: ['投资项目', '推广服务', '达人合作'],
    activeTab: 0,
    list: mock.PROJECTS,
    services: mock.MEDIA_SERVICES,
    platforms: ['全部', '抖音', '快手', '小红书'],
    activePlatform: 0,
    influencers: mock.INFLUENCERS
  },

  onLoad(options) {
    if (options.tab === 'influencer' || options.tab === '2') {
      this.setData({ activeTab: 2 });
    } else if (options.tab === 'service' || options.tab === '1') {
      this.setData({ activeTab: 1 });
    }
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.index });
  },

  filterPlatform(e) {
    const index = e.currentTarget.dataset.index;
    const platform = this.data.platforms[index];
    const list = platform === '全部'
      ? mock.INFLUENCERS
      : mock.INFLUENCERS.filter(i => i.platform === platform);
    this.setData({ activePlatform: index, influencers: list });
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/invest-detail/invest-detail?id=${e.currentTarget.dataset.id}` });
  },

  goPublish() {
    wx.navigateTo({ url: '/pages/invest-publish/invest-publish' });
  },

  goBook(e) {
    wx.navigateTo({ url: `/pages/media-book/media-book?id=${e.currentTarget.dataset.id}` });
  },

  goInfluencerDetail(e) {
    wx.navigateTo({ url: `/pages/influencer-detail/influencer-detail?id=${e.currentTarget.dataset.id}` });
  }
});
