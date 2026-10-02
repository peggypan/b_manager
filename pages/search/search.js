const mock = require('../../services/mock');
const localPublish = require('../../utils/localPublish');

function orderDemandMatches(d, kw) {
  return [d.title, d.company, d.category, d.intro, d.region, d.moq].some((t) =>
    String(t || '').includes(kw),
  );
}

Page({
  data: { keyword: '', results: [], searched: false, scope: '' },

  onLoad(options) {
    const scope = options.scope || '';
    let keyword = options.keyword || '';
    try {
      keyword = decodeURIComponent(keyword);
    } catch (e) {
      /* keep raw */
    }
    this.setData({ scope, keyword });
    if (keyword.trim()) this.doSearch();
  },

  onInput(e) { this.setData({ keyword: e.detail.value }); },

  doSearch() {
    const kw = this.data.keyword.trim();
    if (!kw) return;
    const results = [];
    const scope = this.data.scope;

    const pushOrder = (o) => {
      if (
        o.title.includes(kw) ||
        (o.factoryName && o.factoryName.includes(kw)) ||
        (o.category && o.category.includes(kw)) ||
        (o.intro && o.intro.includes(kw))
      ) {
        results.push({
          type: '订单',
          title: o.title,
          sub: o.factoryName,
          url: `/pages/order-detail/order-detail?id=${o.id}`,
        });
      }
    };

    if (scope === 'order') {
      localPublish.getMergedOrders().forEach(pushOrder);
      mock.DEMANDS.filter((d) => d.type === 'order').forEach((d) => {
        if (orderDemandMatches(d, kw)) {
          results.push({
            type: '找单需求',
            title: d.title,
            sub: d.company,
            url: `/pages/order-market/order-market?tab=demand&keyword=${encodeURIComponent(kw)}`,
          });
        }
      });
      (wx.getStorageSync('localOrderDemands') || []).forEach((d) => {
        if (orderDemandMatches(d, kw)) {
          results.push({
            type: '找单需求',
            title: d.title,
            sub: d.company,
            url: `/pages/order-market/order-market?tab=demand&keyword=${encodeURIComponent(kw)}`,
          });
        }
      });
      this.setData({ results, searched: true });
      return;
    }

    mock.STORE_SUPPLY_PRODUCTS.forEach(p => { if (p.name.includes(kw) || p.factoryName.includes(kw)) results.push({ type: '货源', title: p.name, sub: p.factoryName, url: `/pages/store-supply-detail/store-supply-detail?id=${p.id}` }); });
    mock.FACTORIES.forEach(f => { if (f.name.includes(kw) || f.intro.includes(kw)) results.push({ type: '工厂', title: f.name, sub: f.region, url: `/pages/factory-detail/factory-detail?id=${f.id}` }); });
    mock.ORDERS.forEach(pushOrder);
    mock.PROJECTS.forEach(p => { if (p.name.includes(kw)) results.push({ type: '投资', title: p.name, sub: p.track, url: `/pages/invest-detail/invest-detail?id=${p.id}` }); });
    mock.INFLUENCERS.forEach(i => { if (i.name.includes(kw)) results.push({ type: '达人', title: i.name, sub: i.platform, url: `/pages/influencer-detail/influencer-detail?id=${i.id}` }); });
    mock.getDirectoryCompanies().forEach(c => { if (c.name.includes(kw)) results.push({ type: '企业', title: c.name, sub: c.type, url: `/pages/directory-detail/directory-detail?id=${c.id}` }); });
    mock.INDUSTRY_PARKS.forEach(c => { if (c.name.includes(kw) || c.intro.includes(kw)) results.push({ type: '产业园', title: c.name, sub: c.region, url: `/pages/directory-detail/directory-detail?id=${c.id}` }); });
    mock.ASSOCIATIONS.forEach(c => { if (c.name.includes(kw) || c.intro.includes(kw)) results.push({ type: '商协会', title: c.name, sub: c.region, url: `/pages/directory-detail/directory-detail?id=${c.id}` }); });
    this.setData({ results, searched: true });
  },

  goResult(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }); }
});
