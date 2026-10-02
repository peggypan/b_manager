const mock = require('../../services/mock');
const localPublish = require('../../utils/localPublish');
const { requireContactFields, trim } = require('../../utils/contactForm');
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
      phone: '',
      wechat: '',
    },
    images: [],
    videoPath: '',
    videoThumb: '',
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
    const { form, images, videoPath, videoThumb } = this.data;
    if (!trim(form.name) || !trim(form.type)) {
      showToast('请填写名称和主体类型');
      return;
    }
    const contactErr = requireContactFields(form);
    if (contactErr) {
      showToast(contactErr);
      return;
    }

    const id = Date.now();
    const time = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');
    const image =
      images[0] || `https://picsum.photos/seed/industry${id}/600/400`;

    const record = {
      id,
      name: trim(form.name),
      type: form.type === '产业园' ? '产业园' : '商协会',
      category: form.scale || '综合',
      region: form.region || '全国',
      intro: form.intro || '用户免费入驻',
      products: form.products || '资源对接',
      cert: form.cert || '—',
      phone: trim(form.phone),
      wechat: trim(form.wechat),
      contact: trim(form.contact),
      scale: form.scale || '—',
      image,
      images,
      videoUrl: videoPath,
      videoPoster: videoThumb,
      status: 'published',
    };

    if (form.type === '产业园') {
      localPublish.prepend(localPublish.KEYS.parks, record);
    } else {
      localPublish.prepend(localPublish.KEYS.associations, record);
    }

    const applies = wx.getStorageSync('industryOrgApply') || [];
    applies.unshift({ ...form, id, status: 'published', applyTime: time });
    wx.setStorageSync('industryOrgApply', applies);

    wx.setStorageSync('industryOrg', {
      id,
      name: form.name,
      type: form.type,
      status: 'approved',
      applyTime: new Date().toISOString(),
    });

    const list = wx.getStorageSync('myPublish') || [];
    list.unshift({ id, type: 'industry', title: form.name, time, status: 'published' });
    wx.setStorageSync('myPublish', list);

    showToast('入驻成功，已展示在产业园/商协会');
    setTimeout(() => wx.navigateBack(), 1200);
  },
});
