/**
 * 自定义底部 TabBar
 * @description 五栏布局：首页 | 供需市场 | 大加号 | 宠业社区 | 我的
 */
Component({
  data: {
    selected: 0,
    showPublish: false,
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: '/assets/tabbar/tab-home.jpg' },
      { pagePath: '/pages/market/market', text: '供需市场', icon: '/assets/tabbar/tab-market.jpg' },
      { pagePath: '', text: '发布', isCenter: true },
      { pagePath: '/pages/community/community', text: '宠业社区', icon: '/assets/tabbar/tab-community.jpg' },
      { pagePath: '/pages/user/user', text: '我的', icon: '/assets/tabbar/tab-user.jpg' }
    ],
    publishActions: [
      { name: '发工厂需求', desc: '采购/贴牌/代工', icon: '🏭', theme: 'green', url: '/pages/factory-publish/factory-publish?mode=demand' },
      { name: '发产品订单', desc: '现货/代工方案', icon: '📦', theme: 'blue', url: '/pages/publish-edit/publish-edit?type=order' },
      { name: '发宠投项目', desc: '融资/合作立项', icon: '💼', theme: 'purple', url: '/pages/invest-publish/invest-publish' },
      { name: '发宠业货源', desc: '一件起批·工厂直发', icon: '🚚', theme: 'orange', url: '/pages/store-supply-publish/store-supply-publish' },
      { name: '门店发布求购', desc: '宠物店找货源', icon: '🛒', theme: 'yellow', url: '/pages/store-demand-publish/store-demand-publish', wide: true }
    ],
  },

  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      const item = this.data.list[index];

      if (item.isCenter) {
        this.setData({ showPublish: true });
        return;
      }

      wx.switchTab({ url: item.pagePath });
      this.setData({ selected: index, showPublish: false });
    },

    closePublish() {
      this.setData({ showPublish: false });
    },

    noop() {},

    goPublishAction(e) {
      const { url } = e.currentTarget.dataset;
      this.setData({ showPublish: false });
      wx.navigateTo({ url });
    },

    goMyPublish() {
      this.setData({ showPublish: false, selected: 2 });
      wx.switchTab({ url: '/pages/publish/publish' });
    }
  }
});
