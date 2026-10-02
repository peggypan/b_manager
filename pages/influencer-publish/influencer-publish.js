const { getMembership, getPublishLimit, promptUpgrade } = require('../../utils/member');
const localPublish = require('../../utils/localPublish');
const { requireContactFields, trim } = require('../../utils/contactForm');
const { showToast } = require('../../utils/util');

const PLATFORMS = ['抖音', '快手', '小红书'];

Page({
  data: {
    platforms: PLATFORMS,
    form: {
      name: '',
      platform: '',
      fans: '',
      category: '',
      mode: '',
      intro: '',
      cases: '',
      products: '',
      contact: '',
      phone: '',
      wechat: '',
    },
    images: [],
    videoPath: '',
    videoThumb: '',
  },

  onLoad() {
    if (!getMembership().active) {
      promptUpgrade('开通会员后可入驻达人合作');
    }
  },

  onInput(e) {
    this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value });
  },

  selectPlatform(e) {
    this.setData({ 'form.platform': PLATFORMS[e.detail.value] });
  },

  onMediaChange(e) {
    const { images, videoPath, videoThumb } = e.detail;
    this.setData({ images, videoPath, videoThumb });
  },

  submit() {
    if (!getMembership().active) return promptUpgrade();

    const { form, images, videoPath, videoThumb } = this.data;
    if (
      !trim(form.name) ||
      !trim(form.platform) ||
      !trim(form.fans) ||
      !trim(form.category) ||
      !trim(form.mode) ||
      !trim(form.intro)
    ) {
      showToast('请填写昵称、平台、粉丝、垂类、合作模式和简介');
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

    localPublish.prepend(localPublish.KEYS.influencers, {
      id,
      name: trim(form.name),
      platform: form.platform,
      fans: trim(form.fans),
      category: trim(form.category),
      mode: trim(form.mode),
      intro: trim(form.intro),
      cases: trim(form.cases) || '—',
      products: trim(form.products) || '—',
      contact: trim(form.contact),
      phone: trim(form.phone),
      wechat: trim(form.wechat),
      images: images.length ? images : [`https://picsum.photos/seed/influencer${id}/600/400`],
      videoUrl: videoPath,
      videoPoster: videoThumb,
    });

    list.unshift({
      id,
      type: 'influencer',
      title: form.name,
      time,
      status: 'published',
    });
    wx.setStorageSync('myPublish', list);

    showToast('入驻成功，已展示在达人合作');
    setTimeout(() => wx.navigateBack(), 1200);
  },
});
