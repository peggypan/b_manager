const mock = require('../../services/mock');
const localPublish = require('../../utils/localPublish');

function itemSortKey(item) {
  if (item.time) {
    const parsed = Date.parse(String(item.time).replace(/\./g, '-'));
    if (!Number.isNaN(parsed)) return parsed;
  }
  return Number(item.id) || 0;
}

Page({
  data: {
    tabs: ['全部', '找工厂', '找订单', '门店求购', '投资', '达人', '需求'],
    activeTab: 0,
    keyword: '',
    list: []
  },

  onLoad(options) {
    if (options.keyword) this.setData({ keyword: options.keyword });
    this.loadList();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1, showPublish: false });
    }
    const keyword = wx.getStorageSync('marketKeyword');
    if (keyword) {
      wx.removeStorageSync('marketKeyword');
      this.setData({ keyword });
      this.loadList();
    }
  },

  loadList() {
    const { activeTab, keyword } = this.data;
    let list = [];

    if (activeTab === 0 || activeTab === 1) {
      list = list.concat(mock.FACTORIES.map(f => ({ ...f, listType: 'factory', listTitle: f.name, listSub: `${f.category} · ${f.region}` })));
    }
    if (activeTab === 0 || activeTab === 2) {
      list = list.concat(localPublish.getMergedOrders().map(o => ({ ...o, listType: 'order', listTitle: o.title, listSub: `${o.factoryName} · ${o.type}` })));
    }
    if (activeTab === 0 || activeTab === 3) {
      list = list.concat(localPublish.getMergedStoreDemands().map(d => ({
        ...d, listType: 'storeDemand', listTitle: d.title, listSub: `${d.storeName} · ${d.time}`
      })));
    }
    if (activeTab === 0 || activeTab === 4) {
      list = list.concat(localPublish.getMergedProjects().map(p => ({ ...p, listType: 'invest', listTitle: p.name, listSub: `${p.track} · ${p.stage}` })));
    }
    if (activeTab === 0 || activeTab === 5) {
      list = list.concat(mock.INFLUENCERS.map(i => ({ ...i, listType: 'influencer', listTitle: i.name, listSub: `${i.platform} · ${i.fans}` })));
    }
    if (activeTab === 0 || activeTab === 6) {
      list = list.concat(localPublish.getMergedDemands().map(d => ({ ...d, listType: 'demand', listTitle: d.title, listSub: `${d.company} · ${d.time}` })));
    }

    if (keyword) {
      list = list.filter(item =>
        (item.listTitle && item.listTitle.includes(keyword)) ||
        (item.intro && item.intro.includes(keyword))
      );
    }

    if (activeTab === 6) {
      list.sort((a, b) => itemSortKey(b) - itemSortKey(a));
    } else if (activeTab === 0) {
      list.sort((a, b) => itemSortKey(b) - itemSortKey(a));
    }

    list = list.map((item, index) => ({ ...item, _key: `${item.listType}_${item.id}_${index}` }));
    this.setData({ list });
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.index });
    this.loadList();
  },

  onSearch(e) {
    this.setData({ keyword: e.detail.value });
    this.loadList();
  },

  goOrderMarket() {
    wx.navigateTo({ url: '/pages/order-market/order-market' });
  },

  goDetail(e) {
    const { type, id } = e.currentTarget.dataset;
    const routes = {
      factory: `/pages/factory-detail/factory-detail?id=${id}`,
      order: `/pages/order-detail/order-detail?id=${id}`,
      invest: `/pages/invest-detail/invest-detail?id=${id}`,
      influencer: `/pages/influencer-detail/influencer-detail?id=${id}`,
      demand: `/pages/order-detail/order-detail?kind=demand&id=${id}`,
      storeDemand: `/pages/store-demand-detail/store-demand-detail?id=${id}`
    };
    if (routes[type]) wx.navigateTo({ url: routes[type] });
  }
});
