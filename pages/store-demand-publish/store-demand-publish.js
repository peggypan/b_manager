const { getMembership, getPublishLimit, promptUpgrade } = require('../../utils/member');
const { showToast } = require('../../utils/util');
const mock = require('../../services/mock');

Page({
  data: {
    categories: mock.STORE_SUPPLY_CATEGORIES.filter(c => c !== '全部'),
    form: {
      storeName: '',
      title: '',
      category: '',
      intro: '',
      contact: ''
    },
    images: [],
    videoPath: '',
    videoThumb: ''
  },

  onLoad() {
    if (!getMembership().active) promptUpgrade('门店发布求购需开通会员');
  },

  onInput(e) {
    this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value });
  },

  selectCategory(e) {
    this.setData({ 'form.category': this.data.categories[e.detail.value] });
  },

  onMediaChange(e) {
    const { images, videoPath, videoThumb } = e.detail;
    this.setData({ images, videoPath, videoThumb });
  },

  submit() {
    if (!getMembership().active) return promptUpgrade();
    const { form } = this.data;
    if (!form.storeName || !form.title || !form.intro) {
      showToast('请填写门店名称、求购标题和需求描述');
      return;
    }

    const list = wx.getStorageSync('myPublish') || [];
    const limit = getPublishLimit();
    if (limit >= 0 && list.length >= limit) {
      showToast(`当前会员最多发布${limit}条`);
      return;
    }

    list.unshift({
      id: Date.now(),
      type: 'storeDemand',
      title: form.title,
      time: new Date().toLocaleDateString(),
      status: 'pending'
    });
    wx.setStorageSync('myPublish', list);
    showToast('求购发布成功，等待审核');
    setTimeout(() => wx.navigateBack(), 1500);
  }
});
