const mock = require('../../services/mock');
const { getMembership, getPublishLimit, promptUpgrade } = require('../../utils/member');
const { showToast } = require('../../utils/util');

Page({
  data: {
    categories: mock.STORE_SUPPLY_CATEGORIES.filter(c => c !== '全部'),
    form: {
      name: '', category: '', price: '', specs: '', stock: '',
      delivery: '', afterSale: '', intro: '', origin: ''
    },
    images: [],
    videoPath: '',
    videoThumb: ''
  },

  onLoad() {
    if (!getMembership().active) promptUpgrade('工厂发布货源需开通会员');
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
    if (!form.name || !form.price || !form.category) {
      showToast('请填写产品名称、品类和单价');
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
      type: 'storeSupply',
      title: form.name,
      tags: ['一件起批', '工厂直发'],
      time: new Date().toLocaleDateString(),
      status: 'pending'
    });
    wx.setStorageSync('myPublish', list);
    showToast('货源发布成功，等待审核');
    setTimeout(() => wx.navigateBack(), 1500);
  }
});
