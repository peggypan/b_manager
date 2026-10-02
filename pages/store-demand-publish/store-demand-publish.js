const { getMembership, getPublishLimit, promptUpgrade } = require('../../utils/member');
const localPublish = require('../../utils/localPublish');
const { requireContactFields, trim } = require('../../utils/contactForm');
const { showToast } = require('../../utils/util');
const mock = require('../../services/mock');

Page({
  data: {
    categories: mock.STORE_SUPPLY_CATEGORIES.filter((c) => c !== '全部'),
    form: {
      storeName: '',
      title: '',
      category: '',
      intro: '',
      contact: '',
      phone: '',
      wechat: '',
    },
    images: [],
    videoPath: '',
    videoThumb: '',
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
    const { form, images, videoPath } = this.data;
    if (!trim(form.storeName) || !trim(form.title) || !trim(form.intro)) {
      showToast('请填写门店名称、求购标题和需求描述');
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
    const time = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');

    localPublish.prepend(localPublish.KEYS.storeDemands, {
      id,
      title: form.title,
      storeName: form.storeName,
      category: form.category || '综合',
      intro: form.intro,
      time,
      hasMedia: images.length > 0 || !!videoPath,
      dropship: true,
      region: '全国',
      quantity: '面议',
      detail: form.intro,
      phone: trim(form.phone),
      wechat: trim(form.wechat),
      contact: trim(form.contact),
      images: images.length ? images : [`https://picsum.photos/seed/sdemand${id}/400/400`],
      videoUrl: videoPath,
    });

    list.unshift({
      id,
      type: 'storeDemand',
      title: form.title,
      time,
      status: 'published',
    });
    wx.setStorageSync('myPublish', list);
    showToast('发布成功，已展示在门店货源');
    setTimeout(() => wx.navigateBack(), 1200);
  },
});
