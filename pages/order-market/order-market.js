const mock = require('../../services/mock');
const localPublish = require('../../utils/localPublish');
const { openChat: startChat } = require('../../utils/chat');
const { getMembership, promptUpgrade } = require('../../utils/member');

function mergeDemands() {
  const local = wx.getStorageSync('localOrderDemands') || [];
  const seed = mock.DEMANDS.filter((d) => d.type === 'order');
  const ids = new Set();
  const merged = [];
  [...local, ...seed].forEach((item) => {
    if (item.status === 'offline') return;
    if (ids.has(item.id)) return;
    ids.add(item.id);
    merged.push(item);
  });
  merged.sort((a, b) => {
    const ta = Date.parse(String(a.time || '').replace(/\./g, '-'));
    const tb = Date.parse(String(b.time || '').replace(/\./g, '-'));
    const ka = Number.isNaN(ta) ? Number(a.id) || 0 : ta;
    const kb = Number.isNaN(tb) ? Number(b.id) || 0 : tb;
    return kb - ka;
  });
  return merged;
}

Page({
  data: {
    tabs: ['产品/方案', '需求大厅'],
    activeTab: 0,
    keyword: '',
    allOrders: [],
    allDemands: [],
    orders: [],
    demands: [],
  },

  onLoad(options) {
    if (options.tab === 'demand') {
      this.setData({ activeTab: 1 });
    }
    if (options.keyword) {
      this.setData({ keyword: options.keyword });
    }
    this.reloadLists();
  },

  onShow() {
    this.reloadLists();
  },

  reloadLists() {
    const allOrders = localPublish.getMergedOrders();
    const allDemands = mergeDemands();
    this.setData({ allOrders, allDemands }, () => this.applyFilter());
  },

  applyFilter() {
    const kw = (this.data.keyword || '').trim().toLowerCase();
    const match = (text) => !kw || String(text || '').toLowerCase().includes(kw);

    const orders = this.data.allOrders.filter(
      (o) =>
        match(o.title) ||
        match(o.factoryName) ||
        match(o.category) ||
        match(o.intro) ||
        match(o.type),
    );
    const demands = this.data.allDemands.filter(
      (d) =>
        match(d.title) ||
        match(d.company) ||
        match(d.category) ||
        match(d.intro) ||
        match(d.region),
    );
    this.setData({ orders, demands });
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.index });
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value }, () => this.applyFilter());
  },

  clearSearch() {
    this.setData({ keyword: '' }, () => this.applyFilter());
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/order-detail/order-detail?id=${e.currentTarget.dataset.id}` });
  },

  goPublishDemand() {
    if (!getMembership().active) {
      promptUpgrade('开通会员后可发布找订单需求');
      return;
    }
    wx.navigateTo({ url: '/pages/order-demand-publish/order-demand-publish' });
  },

  goSearchPage() {
    const kw = (this.data.keyword || '').trim();
    const q = kw ? `?scope=order&keyword=${encodeURIComponent(kw)}` : '?scope=order';
    wx.navigateTo({ url: `/pages/search/search${q}` });
  },

  startDemandChat(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.demands.find((d) => String(d.id) === String(id));
    if (!item) return;
    startChat({
      targetId: `order_demand_${item.id}`,
      targetName: item.company || item.title,
      targetType: 'order_demand',
      subtitle: item.title,
    });
  },
});
