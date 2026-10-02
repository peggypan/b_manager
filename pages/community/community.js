const mock = require('../../services/mock');
const {
  getAllPosts,
  splitWaterfall,
  markPostsOwnership,
  deletePost,
} = require('../../utils/community');
const { showToast } = require('../../utils/util');

Page({
  data: {
    tabs: mock.COMMUNITY_TABS,
    activeTab: 0,
    leftCol: [],
    rightCol: [],
    keyword: '',
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3, showPublish: false });
    }
    this.loadFeed();
  },

  loadFeed() {
    const { activeTab, keyword } = this.data;
    const tabName = this.data.tabs[activeTab];
    let list = getAllPosts();

    if (tabName !== '推荐') {
      list = list.filter((p) => p.category === tabName);
    }
    if (keyword) {
      list = list.filter(
        (p) =>
          (p.title && p.title.includes(keyword)) ||
          (p.content && p.content.includes(keyword)) ||
          (p.tags && p.tags.some((t) => t.includes(keyword))),
      );
    }

    list = markPostsOwnership(list);
    const { left, right } = splitWaterfall(list);
    this.setData({ leftCol: left, rightCol: right });
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.index });
    this.loadFeed();
  },

  onSearch(e) {
    this.setData({ keyword: e.detail.value });
    this.loadFeed();
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/community-detail/community-detail?id=${e.currentTarget.dataset.id}` });
  },

  goPublish() {
    wx.navigateTo({ url: '/pages/community-post/community-post' });
  },

  confirmDeleteNote(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除笔记',
      content: '删除后无法恢复，确定删除吗？',
      success: (res) => {
        if (!res.confirm) return;
        deletePost(id);
        showToast('已删除');
        this.loadFeed();
      },
    });
  },
});
