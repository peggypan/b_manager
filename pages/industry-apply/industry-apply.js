/**
 * @page 产业园·商协会入驻申请
 * @description 免费入驻，审核通过后展示；联系方式需会员可见
 */
const mock = require('../../services/mock');
const { showToast } = require('../../utils/util');

Page({
  data: {
    types: mock.INDUSTRY_ORG_TYPES,
    form: {
      name: '',
      type: '',
      region: '',
      scale: '',
      intro: '',
      products: '',
      cert: '',
      contact: '',
      phone: ''
    },
    images: [],
    videoPath: '',
    videoThumb: ''
  },

  onLoad(options) {
    if (options.type && mock.INDUSTRY_ORG_TYPES.includes(options.type)) {
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
      showToast('请填写名称、类型和联系人');
      return;
    }

    const applies = wx.getStorageSync('industryOrgApply') || [];
    applies.unshift({
      ...form,
      id: Date.now(),
      status: 'pending',
      applyTime: new Date().toLocaleDateString()
    });
    wx.setStorageSync('industryOrgApply', applies);

    wx.setStorageSync('industryOrg', {
      name: form.name,
      type: form.type,
      status: 'pending',
      applyTime: new Date().toISOString()
    });

    showToast('入驻申请已提交');
    setTimeout(() => wx.navigateBack(), 1500);
  }
});
