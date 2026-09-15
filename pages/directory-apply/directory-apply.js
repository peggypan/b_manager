const mock = require('../../services/mock');
const { showToast } = require('../../utils/util');

Page({
  data: {
    types: mock.COMPANY_TYPES,
    form: { name: '', type: '', category: '', region: '', intro: '', products: '', contact: '', phone: '' },
    images: [],
    videoPath: '',
    videoThumb: ''
  },

  onLoad(options) {
    if (options.type && mock.COMPANY_TYPES.includes(options.type)) {
      this.setData({ 'form.type': options.type });
    }
  },

  onInput(e) {
    this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value });
  },

  selectType(e) {
    this.setData({ 'form.type': this.data.types[e.detail.value] });
  },

  onMediaChange(e) {
    const { images, videoPath, videoThumb } = e.detail;
    this.setData({ images, videoPath, videoThumb });
  },

  submit() {
    const { form } = this.data;
    if (!form.name || !form.type || !form.contact) {
      showToast('请填写企业名称、类型和联系人');
      return;
    }
    wx.setStorageSync('company', {
      name: form.name,
      type: form.type,
      status: 'pending',
      applyTime: new Date().toISOString()
    });
    showToast('入驻申请已提交');
    setTimeout(() => wx.navigateBack(), 1500);
  }
});
