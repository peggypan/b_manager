/**
 * @page 发布投资项目
 * @router pages/invest-publish/invest-publish
 * @description 填写项目名称、联系方式、融资需求，支持上传 BP（PDF/PPT）
 */
const { getPublishLimit, promptUpgrade, getMembership } = require('../../utils/member');
const localPublish = require('../../utils/localPublish');
const { requireContactFields, trim } = require('../../utils/contactForm');
const { showToast } = require('../../utils/util');

Page({
  data: {
    form: {
      name: '',
      contact: '',
      phone: '',
      wechat: '',
      need: '',
      track: '',
      stage: '',
      intro: ''
    },
    pdfFile: null,
    pptFile: null,
    images: [],
    videoPath: '',
    videoThumb: ''
  },

  onLoad() {
    if (!getMembership().active) {
      promptUpgrade('开通会员后可发布投资项目');
    }
  },

  onInput(e) {
    this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value });
  },

  /**
   * 选择 PDF 或 PPT 文件
   * @param {object} e - 点击事件，type 为 pdf 或 ppt
   */
  chooseFile(e) {
    const fileType = e.currentTarget.dataset.type;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: fileType === 'pdf' ? ['pdf'] : ['ppt', 'pptx'],
      success: (res) => {
        const file = res.tempFiles[0];
        const key = fileType === 'pdf' ? 'pdfFile' : 'pptFile';
        this.setData({
          [key]: {
            name: file.name,
            path: file.path,
            size: file.size
          }
        });
        showToast('文件已选择');
      },
      fail: () => showToast('未选择文件')
    });
  },

  onMediaChange(e) {
    const { images, videoPath, videoThumb } = e.detail;
    this.setData({ images, videoPath, videoThumb });
  },

  /** 移除已选文件 */
  removeFile(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ [type === 'pdf' ? 'pdfFile' : 'pptFile']: null });
  },

  /** 格式化文件大小 */
  formatSize(size) {
    if (size < 1024) return size + 'B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + 'KB';
    return (size / 1024 / 1024).toFixed(1) + 'MB';
  },

  submit() {
    if (!getMembership().active) return promptUpgrade();

    const { form, pdfFile, pptFile } = this.data;
    if (!trim(form.name)) { showToast('请填写项目名称'); return; }
    if (!trim(form.need)) { showToast('请填写融资需求'); return; }
    const contactErr = requireContactFields(form);
    if (contactErr) { showToast(contactErr); return; }

    const list = wx.getStorageSync('myPublish') || [];
    const limit = getPublishLimit();
    if (limit >= 0 && list.length >= limit) {
      showToast(`当前会员最多发布${limit}条`);
      return;
    }

    const id = Date.now();
    const time = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');
    const { images, videoPath, videoThumb } = this.data;

    localPublish.prepend(localPublish.KEYS.projects, {
      id,
      name: form.name,
      track: form.track || '综合',
      stage: form.stage || '融资中',
      need: form.need,
      intro: form.intro || form.need,
      team: `联系人：${trim(form.contact)}`,
      bp: pdfFile ? pdfFile.name : pptFile ? pptFile.name : '',
      phone: trim(form.phone),
      wechat: trim(form.wechat),
      images: images.length ? images : [`https://picsum.photos/seed/project${id}/600/400`],
      videoUrl: videoPath,
      videoPoster: videoThumb,
    });

    list.unshift({
      id,
      type: 'invest',
      title: form.name,
      contact: trim(form.contact),
      phone: trim(form.phone),
      wechat: trim(form.wechat),
      need: form.need,
      track: form.track,
      stage: form.stage,
      intro: form.intro,
      pdfFile: pdfFile ? pdfFile.name : '',
      pptFile: pptFile ? pptFile.name : '',
      time,
      status: 'published',
    });
    wx.setStorageSync('myPublish', list);
    showToast('发布成功，已展示在宠业创投');
    setTimeout(() => wx.navigateBack(), 1200);
  }
});
