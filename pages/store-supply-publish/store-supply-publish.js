const mock = require('../../services/mock');
const { getMembership, getPublishLimit, promptUpgrade } = require('../../utils/member');
const localPublish = require('../../utils/localPublish');
const { requireContactFields, trim } = require('../../utils/contactForm');
const { showToast } = require('../../utils/util');

Page({
  data: {
    categories: mock.STORE_SUPPLY_CATEGORIES.filter((c) => c !== '全部'),
    form: {
      name: '',
      category: '',
      price: '',
      specs: '',
      stock: '',
      delivery: '',
      afterSale: '',
      intro: '',
      origin: '',
      contact: '',
      phone: '',
      wechat: '',
    },
    images: [],
    videoPath: '',
    videoThumb: '',
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
    const { form, images, videoPath, videoThumb } = this.data;
    if (!trim(form.name) || !trim(form.price) || !trim(form.category)) {
      showToast('请填写产品名称、品类和单价');
      return;
    }
    const contactErr = requireContactFields(form);
    if (contactErr) {
      showToast(contactErr);
      return;
    }

    const list = wx.getStorageSync('myPublish') || [];
    const limit = getPublishLimit();
    if (limit >= 0 && list.length >= limit) {
      showToast(`当前会员最多发布${limit}条`);
      return;
    }

    const id = Date.now();
    const company = wx.getStorageSync('company') || {};
    const time = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');
    const cover =
      images[0] || `https://picsum.photos/seed/supply${id}/400/400`;

    localPublish.prepend(localPublish.KEYS.storeProducts, {
      id,
      name: form.name,
      factoryId: 0,
      factoryName: company.name || '工厂直发',
      category: form.category,
      price: form.price,
      moq: form.specs || '1件',
      origin: form.origin || '全国',
      intro: form.intro || form.name,
      dropship: true,
      factoryDirect: true,
      inStock: true,
      hasVideo: !!videoPath,
      image: cover,
      videoCover: videoThumb || cover,
      videoUrl: videoPath,
      phone: trim(form.phone),
      wechat: trim(form.wechat),
      contact: trim(form.contact),
    });

    list.unshift({
      id,
      type: 'storeSupply',
      title: form.name,
      tags: ['一件起批', '工厂直发'],
      time,
      status: 'published',
    });
    wx.setStorageSync('myPublish', list);
    showToast('发布成功，已展示在门店货源');
    setTimeout(() => wx.navigateBack(), 1200);
  },
});
