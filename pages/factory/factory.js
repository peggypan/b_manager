const mock = require('../../services/mock');
const localPublish = require('../../utils/localPublish');

Page({
  data: {
    filters: { category: '全部', bizType: '全部', region: '全部' },
    categories: ['全部', '主粮', '零食', '用品', '保健'],
    bizTypes: ['全部', '现货批发', 'OEM贴牌', 'ODM定制'],
    regions: ['全部', '山东', '浙江', '广东'],
    list: [],
  },

  onShow() {
    this.applyFilter();
  },

  applyFilter() {
    const { filters } = this.data;
    let list = localPublish.getMergedFactories();
    if (filters.category !== '全部') {
      list = list.filter((f) => f.category === filters.category);
    }
    if (filters.bizType !== '全部') {
      list = list.filter((f) => (f.bizTypes || []).includes(filters.bizType));
    }
    if (filters.region !== '全部') {
      list = list.filter((f) => (f.region || '').includes(filters.region));
    }
    this.setData({ list });
  },

  setFilter(e) {
    const { key, value } = e.currentTarget.dataset;
    this.setData({ filters: { ...this.data.filters, [key]: value } }, () => this.applyFilter());
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/factory-detail/factory-detail?id=${e.currentTarget.dataset.id}` });
  },

  goPublish() {
    wx.navigateTo({ url: '/pages/factory-publish/factory-publish?mode=info' });
  },
});
