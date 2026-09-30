const mock = require('../../services/mock');

function filterList(type, keyword) {
  let list = mock.getDirectoryListByFilter(type);
  if (keyword) {
    list = list.filter(
      (c) => c.name.includes(keyword) || (c.intro && c.intro.includes(keyword))
    );
  }
  return list;
}

Page({
  data: {
    types: mock.DIRECTORY_FILTER_TYPES,
    activeType: 0,
    list: filterList('全部', ''),
    keyword: ''
  },

  filterType(e) {
    const index = e.currentTarget.dataset.index;
    const type = this.data.types[index];
    this.setData({
      activeType: index,
      list: filterList(type, this.data.keyword)
    });
  },

  onSearch(e) {
    const keyword = e.detail.value;
    const type = this.data.types[this.data.activeType];
    this.setData({ keyword, list: filterList(type, keyword) });
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/directory-detail/directory-detail?id=${e.currentTarget.dataset.id}` });
  },

  goApply() {
    wx.navigateTo({ url: '/pages/directory-apply/directory-apply' });
  }
});
