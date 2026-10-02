const { getPublishLimit, promptUpgrade, getMembership } = require('../../utils/member');
const localPublish = require('../../utils/localPublish');
const { requireContactFields, trim } = require('../../utils/contactForm');
const { showToast } = require('../../utils/util');

const CATEGORIES = ['主粮', '零食', '用品', '保健'];
const BIZ_OPTIONS = ['现货批发', 'OEM贴牌', 'ODM定制'];
const TAG_OPTIONS = ['可打样', '支持贴牌'];

Page({
  data: {
    mode: 'demand',
    categories: CATEGORIES,
    bizOptions: BIZ_OPTIONS,
    tagOptions: TAG_OPTIONS,
    form: {
      title: '',
      name: '',
      category: '',
      moq: '',
      region: '',
      intro: '',
      capacity: '',
      cert: '',
      samplePolicy: '',
      contact: '',
      phone: '',
      wechat: '',
    },
    selectedBiz: [],
    selectedTags: [],
    images: [],
    videoPath: '',
    videoThumb: '',
    editId: null,
  },

  onLoad(options) {
    const mode = options.mode === 'info' ? 'info' : 'demand';
    const title = mode === 'info' ? '发布工厂信息' : '发布工厂需求';
    wx.setNavigationBarTitle({ title });

    if (!getMembership().active) {
      const tip =
        mode === 'info'
          ? '开通会员后可发布工厂信息'
          : '开通会员后可发布工厂采购/贴牌需求';
      promptUpgrade(tip);
    }

    this.setData({ mode });

    if (options.id) {
      this.loadForEdit(Number(options.id), mode);
    }
  },

  loadForEdit(id, mode) {
    if (mode === 'info') {
      const item = (wx.getStorageSync(localPublish.KEYS.factories) || []).find(
        (x) => Number(x.id) === id,
      );
      if (!item) return;
      this.setData({
        editId: id,
        form: {
          name: item.name || '',
          category: item.category || '',
          moq: item.moq || '',
          region: item.region || '',
          intro: item.intro || '',
          capacity: item.capacity || '',
          cert: item.cert || '',
          samplePolicy: item.samplePolicy || '',
          contact: item.contact || '',
          phone: item.phone || '',
          wechat: item.wechat || '',
          title: '',
        },
        selectedBiz: item.bizTypes || [],
        selectedTags: item.tags || [],
        images: item.images || [],
        videoPath: item.videoUrl || '',
        videoThumb: item.videoPoster || '',
      });
      return;
    }

    const item = (wx.getStorageSync(localPublish.KEYS.demands) || []).find(
      (x) => Number(x.id) === id,
    );
    if (!item) return;
    this.setData({
      editId: id,
      form: {
        title: item.title || '',
        category: item.category || '',
        moq: item.moq || '',
        region: item.region || '',
        intro: item.intro || '',
        name: '',
        capacity: '',
        cert: '',
        samplePolicy: '',
        phone: '',
        wechat: '',
      },
      images: item.images || [],
      videoPath: item.videoUrl || '',
      videoThumb: item.videoPoster || '',
    });
  },

  onInput(e) {
    this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value });
  },

  selectCategory(e) {
    this.setData({ 'form.category': this.data.categories[e.detail.value] });
  },

  toggleBiz(e) {
    const { value } = e.currentTarget.dataset;
    const set = new Set(this.data.selectedBiz);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    this.setData({ selectedBiz: [...set] });
  },

  toggleTag(e) {
    const { value } = e.currentTarget.dataset;
    const set = new Set(this.data.selectedTags);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    this.setData({ selectedTags: [...set] });
  },

  onMediaChange(e) {
    const { images, videoPath, videoThumb } = e.detail;
    this.setData({ images, videoPath, videoThumb });
  },

  submit() {
    if (!getMembership().active) return promptUpgrade();

    if (this.data.mode === 'info') {
      this.submitFactoryInfo();
      return;
    }
    this.submitDemand();
  },

  submitFactoryInfo() {
    const { form, selectedBiz, selectedTags, images, videoPath, videoThumb, editId } =
      this.data;
    if (!trim(form.name) || !trim(form.category) || !trim(form.intro)) {
      showToast('请填写工厂名称、品类和简介');
      return;
    }
    if (!selectedBiz.length) {
      showToast('请至少选择一种业务类型');
      return;
    }
    const contactErr = requireContactFields(form, { contactLabel: '联系人' });
    if (contactErr) {
      showToast(contactErr);
      return;
    }

    const list = wx.getStorageSync('myPublish') || [];
    const limit = getPublishLimit();
    if (!editId && limit >= 0 && list.length >= limit) {
      showToast(`当前会员最多发布${limit}条`);
      return;
    }

    const id = editId || Date.now();
    const time = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');
    const record = {
      id,
      name: form.name.trim(),
      category: form.category,
      bizTypes: selectedBiz,
      tags: selectedTags,
      moq: form.moq || '面议',
      region: form.region || '—',
      intro: form.intro.trim(),
      capacity: form.capacity || '—',
      cert: form.cert || '—',
      samplePolicy: form.samplePolicy || '—',
      contact: trim(form.contact),
      phone: trim(form.phone),
      wechat: trim(form.wechat),
      images,
      videoUrl: videoPath,
      videoPoster: videoThumb,
      memberOnly: true,
      time,
      status: 'published',
    };

    if (editId) {
      const factories = wx.getStorageSync(localPublish.KEYS.factories) || [];
      wx.setStorageSync(
        localPublish.KEYS.factories,
        factories.map((x) => (Number(x.id) === id ? record : x)),
      );
      const pub = list.map((p) =>
        Number(p.id) === id && p.type === 'factory_info'
          ? { ...p, title: record.name, time }
          : p,
      );
      wx.setStorageSync('myPublish', pub);
      showToast('已保存');
    } else {
      localPublish.prepend(localPublish.KEYS.factories, record);
      list.unshift({
        id,
        type: 'factory_info',
        title: record.name,
        time,
        status: 'published',
      });
      wx.setStorageSync('myPublish', list);
      showToast('发布成功，已展示在找工厂列表');
    }

    setTimeout(() => wx.navigateBack(), 1200);
  },

  submitDemand() {
    const { form, images, videoPath, editId } = this.data;
    if (!form.title || !form.intro) {
      showToast('请填写需求标题和描述');
      return;
    }

    const list = wx.getStorageSync('myPublish') || [];
    const limit = getPublishLimit();
    if (!editId && limit >= 0 && list.length >= limit) {
      showToast(`当前会员最多发布${limit}条`);
      return;
    }

    const id = editId || Date.now();
    const company = wx.getStorageSync('company') || {};
    const time = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');

    const record = {
      id,
      type: 'factory',
      title: form.title.trim(),
      company: company.name || '采购企业',
      category: form.category || '—',
      moq: form.moq || '面议',
      region: form.region || '不限',
      intro: form.intro.trim(),
      time,
      images,
      videoUrl: videoPath,
      status: 'published',
    };

    if (editId) {
      const demands = wx.getStorageSync(localPublish.KEYS.demands) || [];
      wx.setStorageSync(
        localPublish.KEYS.demands,
        demands.map((x) => (Number(x.id) === id ? record : x)),
      );
      const pub = list.map((p) =>
        Number(p.id) === id && p.type === 'factory'
          ? { ...p, title: record.title, time }
          : p,
      );
      wx.setStorageSync('myPublish', pub);
      showToast('已保存');
    } else {
      localPublish.prepend(localPublish.KEYS.demands, record);
      list.unshift({
        id,
        type: 'factory',
        title: record.title,
        time,
        status: 'published',
      });
      wx.setStorageSync('myPublish', list);
      showToast('发布成功，已展示在供需市场');
    }

    setTimeout(() => wx.navigateBack(), 1200);
  },
});
