const mock = require('../../services/mock');
const localPublish = require('../../utils/localPublish');
const { requireContactFields, trim } = require('../../utils/contactForm');
const { showToast } = require('../../utils/util');

Page({
  data: {
    types: mock.COMPANY_TYPES,
    form: {
      name: '',
      type: '',
      category: '',
      region: '',
      intro: '',
      products: '',
      contact: '',
      phone: '',
      wechat: '',
    },
    images: [],
    videoPath: '',
    videoThumb: '',
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
    const { form, images, videoPath, videoThumb } = this.data;
    if (!trim(form.name) || !trim(form.type)) {
      showToast('请填写企业名称和主体类型');
      return;
    }
    const contactErr = requireContactFields(form);
    if (contactErr) {
      showToast(contactErr);
      return;
    }

    const id = Date.now();
    const image =
      images[0] || `https://picsum.photos/seed/dir${id}/600/400`;

    localPublish.prepend(localPublish.KEYS.directory, {
      id,
      name: trim(form.name),
      type: form.type,
      category: form.category || form.type,
      region: form.region || '全国',
      intro: form.intro || form.products || '用户入驻展示',
      products: form.products,
      phone: trim(form.phone),
      wechat: trim(form.wechat),
      contact: trim(form.contact),
      image,
      images,
      videoUrl: videoPath,
      videoPoster: videoThumb,
      status: 'published',
    });

    wx.setStorageSync('company', {
      name: form.name,
      type: form.type,
      status: 'approved',
      applyTime: new Date().toISOString(),
    });

    const list = wx.getStorageSync('myPublish') || [];
    list.unshift({
      id,
      type: 'directory',
      title: form.name,
      time: new Date().toLocaleDateString('zh-CN').replace(/\//g, '-'),
      status: 'published',
    });
    wx.setStorageSync('myPublish', list);

    showToast('入驻成功，已展示在宠业展厅');
    setTimeout(() => wx.navigateBack(), 1200);
  },
});
