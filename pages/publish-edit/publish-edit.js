const { getPublishLimit, promptUpgrade, getMembership } = require('../../utils/member');
const { showToast } = require('../../utils/util');

const TYPE_NAMES = { order: '产品/订单', invest: '投资项目', influencer: '达人招募' };

Page({
  data: {
    type: 'order',
    typeName: '',
    form: { title: '', intro: '' },
    images: [],
    videoPath: '',
    videoThumb: ''
  },

  onLoad(options) {
    const type = options.type || 'order';
    this.setData({ type, typeName: TYPE_NAMES[type] || '信息' });
    wx.setNavigationBarTitle({ title: `发布${TYPE_NAMES[type]}` });
    if (!getMembership().active) promptUpgrade();
  },

  onInput(e) {
    this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value });
  },

  onMediaChange(e) {
    const { images, videoPath, videoThumb } = e.detail;
    this.setData({ images, videoPath, videoThumb });
  },

  submit() {
    if (!getMembership().active) return promptUpgrade();
    const { form, type } = this.data;
    if (!form.title || !form.intro) { showToast('请填写标题和描述'); return; }

    const list = wx.getStorageSync('myPublish') || [];
    const limit = getPublishLimit();
    if (limit >= 0 && list.length >= limit) {
      showToast(`当前会员最多发布${limit}条`);
      return;
    }

    list.unshift({ id: Date.now(), type, title: form.title, time: new Date().toLocaleDateString(), status: 'pending' });
    wx.setStorageSync('myPublish', list);
    showToast('发布成功，等待审核');
    setTimeout(() => wx.navigateBack(), 1500);
  }
});
