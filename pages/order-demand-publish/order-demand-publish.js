const { getMembership, getPublishLimit, promptUpgrade } = require('../../utils/member');
const { requireContactFields, trim } = require('../../utils/contactForm');
const { showToast } = require('../../utils/util');

Page({
  data: {
    editId: null,
    form: {
      title: '',
      company: '',
      category: '',
      moq: '',
      region: '',
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
    if (!getMembership().active) {
      promptUpgrade('开通会员后可发布找订单需求');
    }
    const editId = options.id ? Number(options.id) : null;
    if (!editId) return;
    const demand = (wx.getStorageSync('localOrderDemands') || []).find(
      (d) => Number(d.id) === editId,
    );
    if (!demand) {
      showToast('需求不存在');
      return;
    }
    wx.setNavigationBarTitle({ title: '编辑找单需求' });
    this.setData({
      editId,
      form: {
        title: demand.title || '',
        company: demand.company || '',
        category: demand.category || '',
        moq: demand.moq || '',
        region: demand.region || '',
        intro: demand.intro || '',
        contact: demand.contact || '',
        phone: demand.phone || '',
        wechat: demand.wechat || '',
      },
      images: demand.images || [],
      videoPath: demand.videoUrl || '',
      videoThumb: demand.videoPoster || '',
    });
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

    const { form, images, videoPath, editId } = this.data;
    if (!trim(form.title) || !trim(form.company) || !trim(form.intro)) {
      showToast('请填写标题、企业名称和需求描述');
      return;
    }
    const contactErr = requireContactFields(form);
    if (contactErr) {
      showToast(contactErr);
      return;
    }

    const time = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');
    const demand = {
      id: editId || Date.now(),
      type: 'order',
      title: trim(form.title),
      company: trim(form.company),
      category: form.category || '—',
      moq: form.moq || '面议',
      region: form.region || '不限',
      intro: trim(form.intro),
      contact: trim(form.contact),
      phone: trim(form.phone),
      wechat: trim(form.wechat),
      time,
      images,
      videoUrl: videoPath,
      status: 'published',
    };

    let localDemands = wx.getStorageSync('localOrderDemands') || [];
    if (editId) {
      localDemands = localDemands.map((d) =>
        Number(d.id) === editId ? { ...d, ...demand } : d,
      );
    } else {
      const publishList = wx.getStorageSync('myPublish') || [];
      const limit = getPublishLimit();
      if (limit >= 0 && publishList.length >= limit) {
        showToast(`当前会员最多发布${limit}条`);
        return;
      }
      localDemands.unshift(demand);
      publishList.unshift({
        id: demand.id,
        type: 'order_demand',
        title: form.title,
        time,
        status: 'published',
      });
      wx.setStorageSync('myPublish', publishList);
    }
    wx.setStorageSync('localOrderDemands', localDemands);

    const publishList = wx.getStorageSync('myPublish') || [];
    wx.setStorageSync(
      'myPublish',
      publishList.map((p) =>
        Number(p.id) === demand.id
          ? { ...p, title: form.title, time, status: 'published' }
          : p,
      ),
    );

    showToast(editId ? '已保存' : '发布成功，已展示在需求大厅');
    setTimeout(() => {
      if (editId) wx.navigateBack();
      else wx.redirectTo({ url: '/pages/order-market/order-market?tab=demand' });
    }, 1200);
  },
});
