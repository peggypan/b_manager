const { getPublishLimit, promptUpgrade, getMembership } = require('../../utils/member');
const { showToast } = require('../../utils/util');

Page({
  data: {
    form: { title: '', category: '', moq: '', region: '', intro: '' },
    images: [],
    videoPath: '',
    videoThumb: ''
  },

  onLoad() {
    if (!getMembership().active) {
      promptUpgrade('开通会员后可发布工厂采购/贴牌需求');
    }
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

    const { form } = this.data;
    if (!form.title || !form.intro) { showToast('请填写需求标题和描述'); return; }

    const list = wx.getStorageSync('myPublish') || [];
    const limit = getPublishLimit();
    if (limit >= 0 && list.length >= limit) {
      showToast(`当前会员最多发布${limit}条`);
      return;
    }

    list.unshift({
      id: Date.now(),
      type: 'factory',
      title: form.title,
      time: new Date().toLocaleDateString(),
      status: 'pending'
    });
    wx.setStorageSync('myPublish', list);
    showToast('发布成功，等待审核');
    setTimeout(() => wx.navigateBack(), 1500);
  }
});
