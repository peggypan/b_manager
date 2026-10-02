const localPublish = require('../../utils/localPublish');
const { openJoinMenu } = require('../../utils/joinMenu');

const SECTION_META = [
  {
    key: '工厂',
    title: '宠物工厂',
    label: '宠物工厂',
    icon: '🏭',
    subtitle: '代工生产 · 供应链对接',
    theme: 'blue',
  },
  {
    key: '品牌',
    title: '宠物品牌',
    label: '宠物品牌',
    icon: '✨',
    subtitle: '品牌方 · 产品合作',
    theme: 'purple',
  },
  {
    key: '商家',
    title: '宠物商家',
    label: '宠物商家',
    icon: '🏪',
    subtitle: '门店 · 渠道零售',
    theme: 'green',
  },
  {
    key: '宠物产业园',
    title: '宠物产业园',
    label: '宠物产业园',
    icon: '🏛️',
    subtitle: '产业集聚 · 政策扶持',
    theme: 'indigo',
  },
  {
    key: '宠物商协会',
    title: '宠物商协会',
    label: '宠物商协会',
    icon: '🤝',
    subtitle: '行业组织 · 资源链接',
    theme: 'amber',
  },
];

function filterList(type, keyword) {
  let list = localPublish.getDirectoryListByFilter(type);
  if (keyword) {
    list = list.filter(
      (c) => c.name.includes(keyword) || (c.intro && c.intro.includes(keyword)),
    );
  }
  return list;
}

Page({
  data: {
    keyword: '',
    modules: SECTION_META,
    activeKey: SECTION_META[0].key,
    list: filterList(SECTION_META[0].key, ''),
  },

  onShow() {
    this.refreshList();
  },

  refreshList() {
    const { activeKey, keyword } = this.data;
    this.setData({ list: filterList(activeKey, keyword) });
  },

  selectModule(e) {
    const key = e.currentTarget.dataset.key;
    if (key === this.data.activeKey) return;
    this.setData({ activeKey: key }, () => {
      this.refreshList();
      wx.pageScrollTo({ scrollTop: 0, duration: 200 });
    });
  },

  onSearch(e) {
    this.setData({ keyword: e.detail.value }, () => this.refreshList());
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/directory-detail/directory-detail?id=${e.currentTarget.dataset.id}` });
  },

  goApply() {
    openJoinMenu();
  },
});
