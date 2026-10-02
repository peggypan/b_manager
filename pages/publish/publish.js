const { getMembership, getPublishLimit } = require('../../utils/member');
const {
  TYPE_LABELS,
  buildAllPublishRows,
  filterRowsByTab,
  offlinePublishEntry,
  removePublishEntry,
} = require('../../utils/userContent');
const { showToast } = require('../../utils/util');

const TAB_KEYS = [
  '',
  'community',
  'factory',
  'order_group',
  'storeSupply',
  'storeDemand',
  'directory',
  'invest',
  'industry',
];

const STATUS_TEXT = {
  pending: '审核中',
  published: '已发布',
  approved: '已发布',
  offline: '已下架',
};

const EDITABLE_TYPES = new Set([
  'community',
  'factory',
  'factory_info',
  'order',
  'order_demand',
  'storeSupply',
  'storeDemand',
  'directory',
  'invest',
  'industry',
  'influencer',
]);

Page({
  data: {
    tabs: [
      '全部',
      '社区帖子',
      '找工厂',
      '找订单',
      '门店货源',
      '门店求购',
      '宠业展厅',
      '宠业创投',
      '免费入驻',
    ],
    activeTab: 0,
    publishList: [],
    publishLimit: 0,
    publishUsed: 0,
    membership: {},
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2, showPublish: false });
    }
    this.loadData();
  },

  loadData() {
    const membership = getMembership();
    const limit = getPublishLimit();
    const myPublishOnly = wx.getStorageSync('myPublish') || [];
    this.setData({
      membership,
      publishLimit: limit,
      publishUsed: myPublishOnly.length,
    });
    this.filterList();
  },

  filterList() {
    const tabKey = TAB_KEYS[this.data.activeTab];
    const rows = filterRowsByTab(buildAllPublishRows(), tabKey);
    this.setData({
      publishList: rows.map((item) => {
        const offline = item.status === 'offline';
        return {
          ...item,
          typeLabel: TYPE_LABELS[item.type] || item.type,
          statusText: STATUS_TEXT[item.status] || item.status || '已发布',
          canEdit: !offline && EDITABLE_TYPES.has(item.type),
          canOffline: !offline,
        };
      }),
    });
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.index });
    this.filterList();
  },

  editItem(e) {
    const { id, type } = e.currentTarget.dataset;
    const routes = {
      community: `/pages/community-post/community-post?id=${id}`,
      factory: `/pages/factory-publish/factory-publish?mode=demand&id=${id}`,
      factory_info: `/pages/factory-publish/factory-publish?mode=info&id=${id}`,
      order: `/pages/publish-edit/publish-edit?id=${id}&type=order`,
      order_demand: `/pages/order-demand-publish/order-demand-publish?id=${id}`,
      invest: `/pages/invest-publish/invest-publish?id=${id}`,
      storeSupply: '/pages/store-supply-publish/store-supply-publish',
      storeDemand: '/pages/store-demand-publish/store-demand-publish',
      directory: '/pages/directory-apply/directory-apply',
      industry: '/pages/industry-apply/industry-apply',
      influencer: '/pages/influencer-publish/influencer-publish',
    };
    const url = routes[type];
    if (!url) {
      showToast('暂不支持编辑，请删除后重新发布');
      return;
    }
    wx.navigateTo({ url });
  },

  offlineItem(e) {
    const { id, type } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认下架',
      content: '下架后前台将不再展示，可在「编辑」后重新上架',
      success: (res) => {
        if (!res.confirm) return;
        const result = offlinePublishEntry(id, type);
        if (result && result.ok === false) {
          showToast(result.message);
          return;
        }
        this.loadData();
        showToast('已下架');
      },
    });
  },

  removeItem(e) {
    const { id, type } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定删除吗？',
      success: (res) => {
        if (!res.confirm) return;
        removePublishEntry(id, type);
        this.loadData();
        showToast('已删除');
      },
    });
  },
});
