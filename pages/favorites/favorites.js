const mock = require('../../services/mock');

Page({
  data: { list: [] },

  onShow() { this.loadFavorites(); },

  loadFavorites() {
    const favs = wx.getStorageSync('favorites') || [];
    const typeMap = {
      factory: { data: mock.FACTORIES, url: '/pages/factory-detail/factory-detail' },
      company: { data: mock.COMPANIES, url: '/pages/directory-detail/directory-detail' },
      invest: { data: mock.PROJECTS, url: '/pages/invest-detail/invest-detail' },
      influencer: { data: mock.INFLUENCERS, url: '/pages/influencer-detail/influencer-detail' }
    };
    const list = favs.map(f => {
      const conf = typeMap[f.type];
      if (!conf) return null;
      const item = conf.data.find(d => d.id === f.id);
      if (!item) return null;
      return { ...f, title: item.name, url: `${conf.url}?id=${f.id}` };
    }).filter(Boolean);
    this.setData({ list });
  },

  goDetail(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }); }
});
