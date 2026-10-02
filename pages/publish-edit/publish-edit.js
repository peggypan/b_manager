const { getPublishLimit, promptUpgrade, getMembership } = require('../../utils/member');
const localPublish = require('../../utils/localPublish');
const { requireContactFields, trim } = require('../../utils/contactForm');
const { showToast } = require('../../utils/util');

const TYPE_NAMES = { order: '产品/订单', invest: '投资项目', influencer: '达人招募' };

Page({
  data: {
    type: 'order',
    typeName: '',
    form: {
      title: '',
      intro: '',
      contact: '',
      phone: '',
      wechat: '',
    },
    images: [],
    videoPath: '',
    videoThumb: '',
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
    const { form, type, images, videoPath, videoThumb } = this.data;
    if (!trim(form.title) || !trim(form.intro)) {
      showToast('请填写标题和描述');
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
    const company = wx.getStorageSync('company') || {};

    if (type === 'order') {
      localPublish.prepend(localPublish.KEYS.orders, {
        id,
        factoryName: company.name || '发布企业',
        title: trim(form.title),
        type: '现货产品',
        category: '综合',
        moq: '面议',
        price: '面议',
        delivery: '详谈',
        intro: trim(form.intro),
        params: '—',
        cases: '用户发布',
        contact: trim(form.contact),
        phone: trim(form.phone),
        wechat: trim(form.wechat),
        images: images.length ? images : [`https://picsum.photos/seed/order${id}/600/400`],
        videoUrl: videoPath,
        videoPoster: videoThumb,
      });
    }

    list.unshift({ id, type, title: form.title, time, status: 'published' });
    wx.setStorageSync('myPublish', list);
    showToast(type === 'order' ? '发布成功，已展示在找订单' : '发布成功');
    setTimeout(() => wx.navigateBack(), 1200);
  },
});
