const chat = require('../../utils/chat');
const { showToast } = require('../../utils/util');

Page({
  data: {
    targetId: '',
    targetName: '',
    targetType: '',
    subtitle: '',
    messages: [],
    inputText: '',
    scrollTo: '',
  },

  onLoad(options) {
    const targetId = decodeURIComponent(options.targetId || '');
    const targetName = decodeURIComponent(options.targetName || '');
    const targetType = decodeURIComponent(options.targetType || 'other');
    const subtitle = options.subtitle ? decodeURIComponent(options.subtitle) : '';
    if (!targetId || !targetName) {
      showToast('会话参数无效');
      setTimeout(() => wx.navigateBack(), 600);
      return;
    }
    wx.setNavigationBarTitle({ title: targetName });
    this.setData({ targetId, targetName, targetType, subtitle });
    this.loadMessages();
  },

  onShow() {
    if (this.data.targetId) this.loadMessages();
  },

  loadMessages() {
    const { targetId, targetName } = this.data;
    chat.ensureWelcome(targetId, targetName);
    const messages = chat.getMessages(targetId);
    this.setData({ messages }, () => this.scrollBottom());
  },

  scrollBottom() {
    const n = this.data.messages.length;
    if (n === 0) return;
    this.setData({ scrollTo: `msg${n - 1}` });
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  send() {
    const text = (this.data.inputText || '').trim();
    if (!text) {
      showToast('请输入消息');
      return;
    }
    const { targetId, targetName } = this.data;
    chat.appendMessage(targetId, { from: 'me', content: text });
    chat.upsertSession({
      targetId,
      targetName,
      targetType: this.data.targetType,
      subtitle: this.data.subtitle,
      lastMessage: text,
      updatedAt: Date.now(),
    });
    chat.mockReply(targetId, targetName, text);
    this.setData({ inputText: '' });
    this.loadMessages();
  },
});
