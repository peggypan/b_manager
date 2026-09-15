const mock = require('../../services/mock');

Page({
  data: {
    types: ['全部', ...mock.COMPANY_TYPES],
    activeType: 0,
    list: mock.getDirectoryCompanies(),
    keyword: ''
  },

  filterType(e) {
    const type = this.data.types[e.currentTarget.dataset.index];
    const all = mock.getDirectoryCompanies();
    let list = type === '全部' ? all : all.filter(c => c.type === type);
    if (this.data.keyword) list = list.filter(c => c.name.includes(this.data.keyword));
    this.setData({ activeType: e.currentTarget.dataset.index, list });
  },

  onSearch(e) {
    const keyword = e.detail.value;
    let list = mock.getDirectoryCompanies();
    const type = this.data.types[this.data.activeType];
    if (type !== '全部') list = list.filter(c => c.type === type);
    if (keyword) list = list.filter(c => c.name.includes(keyword) || c.intro.includes(keyword));
    this.setData({ keyword, list });
  },

  goDetail(e) { wx.navigateTo({ url: `/pages/directory-detail/directory-detail?id=${e.currentTarget.dataset.id}` }); },

  goApply() { wx.navigateTo({ url: '/pages/directory-apply/directory-apply' }); }
});
