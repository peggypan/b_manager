const { showToast } = require('../../utils/util');

Page({
  data: {
    tabs: ['留言', '平台通知', '合作意向'],
    activeTab: 0,
    messages: [
      { id: 1, type: 'leave', from: '喵星品牌', content: '您好，我们对贵司OEM服务感兴趣', time: '09-12 14:30', read: false },
      { id: 2, type: 'notice', from: '平台通知', content: '您的企业入驻申请正在审核中', time: '09-10 09:00', read: true },
      { id: 3, type: 'intent', from: '汪星人连锁', content: '意向合作：采购冻干零食', time: '09-08 16:20', read: false }
    ],
    compose: { target: '', content: '' },
    showCompose: false
  },

  onLoad(options) {
    if (options.action === 'compose') this.setData({ showCompose: true });
  },

  switchTab(e) { this.setData({ activeTab: e.currentTarget.dataset.index }); },

  onComposeInput(e) {
    this.setData({ [`compose.${e.currentTarget.dataset.field}`]: e.detail.value });
  },

  sendMessage() {
    const { compose } = this.data;
    if (!compose.content) { showToast('请输入留言内容'); return; }
    showToast('留言已发送');
    this.setData({ showCompose: false, 'compose.content': '' });
  }
});
