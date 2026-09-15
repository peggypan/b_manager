/**
 * @page 门店货源
 * @description 面向线下宠物店老板，一件起批、工厂直发、无需囤货
 */
const mock = require('../../services/mock');

Page({
  data: {
    categories: mock.STORE_SUPPLY_CATEGORIES,
    origins: mock.STORE_SUPPLY_ORIGINS,
    filters: { category: '全部', origin: '全部', dropship: false, inStock: '全部' },
    list: mock.STORE_SUPPLY_PRODUCTS,
    demands: mock.STORE_SUPPLY_DEMANDS,
    showDemands: false
  },

  setFilter(e) {
    const { key, value } = e.currentTarget.dataset;
    const filters = { ...this.data.filters, [key]: value };
    this.setData({ filters });
    this.loadList();
  },

  toggleDropship() {
    this.setData({ 'filters.dropship': !this.data.filters.dropship });
    this.loadList();
  },

  loadList() {
    const { category, origin, dropship, inStock } = this.data.filters;
    let list = [...mock.STORE_SUPPLY_PRODUCTS];
    if (category !== '全部') list = list.filter(p => p.category === category);
    if (origin !== '全部') list = list.filter(p => p.origin === origin);
    if (dropship) list = list.filter(p => p.dropship);
    if (inStock === '现货') list = list.filter(p => p.inStock);
    if (inStock === '预订') list = list.filter(p => !p.inStock);
    this.setData({ list });
  },

  toggleDemands() {
    this.setData({ showDemands: !this.data.showDemands });
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/store-supply-detail/store-supply-detail?id=${e.currentTarget.dataset.id}` });
  },

  goFactoryPublish() {
    wx.navigateTo({ url: '/pages/store-supply-publish/store-supply-publish' });
  },

  goStoreDemand() {
    wx.navigateTo({ url: '/pages/store-demand-publish/store-demand-publish' });
  },

  goDemandDetail(e) {
    wx.navigateTo({ url: `/pages/store-demand-detail/store-demand-detail?id=${e.currentTarget.dataset.id}` });
  }
});
