const chat = require('../../utils/chat');

Page({
  data: {
    tabs: ['会话', '平台通知', '合作意向'],
    activeTab: 0,
    sessions: [],
    notices: [
      { id: 1, from: '平台通知', content: '您的企业入驻申请正在审核中', time: '09-10 09:00', read: true },
      { id: 2, from: '平台通知', content: '会员将于 30 天后到期，请及时续费', time: '09-01 10:00', read: true },
    ],
    intents: [
      { id: 1, from: '汪星人连锁', content: '意向合作：采购冻干零食', time: '09-08 16:20', read: false },
    ],
  },

  onShow() {
    this.loadSessions();
  },

  loadSessions() {
    const sessions = chat.listSessions().map((s) => ({
      ...s,
      updatedAtText: s.updatedAt ? chat.formatTime(new Date(s.updatedAt)) : '',
    }));
    this.setData({ sessions });
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.index });
  },

  openSession(e) {
    const { id, name, type, subtitle } = e.currentTarget.dataset;
    chat.openChat({
      targetId: id,
      targetName: name,
      targetType: type,
      subtitle: subtitle || '',
    });
  },
});
