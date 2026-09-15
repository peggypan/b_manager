const mock = require('../../services/mock');
const { showToast } = require('../../utils/util');

Page({
  data: {
    service: null,
    form: { company: '', contact: '', phone: '', demand: '' },
    bookings: [],
    images: [],
    videoPath: '',
    videoThumb: ''
  },

  onLoad(options) {
    const service = mock.MEDIA_SERVICES.find(s => s.id === Number(options.id));
    if (service) this.setData({ service });
    this.setData({ bookings: wx.getStorageSync('mediaBookings') || [] });
  },

  onInput(e) {
    this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value });
  },

  onMediaChange(e) {
    const { images, videoPath, videoThumb } = e.detail;
    this.setData({ images, videoPath, videoThumb });
  },

  submit() {
    const { form, service } = this.data;
    if (!form.company || !form.contact || !form.phone) {
      showToast('请填写企业名称、联系人和电话');
      return;
    }
    const bookings = wx.getStorageSync('mediaBookings') || [];
    bookings.unshift({
      id: Date.now(),
      serviceName: service ? service.name : '新媒体服务',
      ...form,
      status: 'pending',
      time: new Date().toLocaleDateString()
    });
    wx.setStorageSync('mediaBookings', bookings);
    showToast('预约已提交，商务将联系您');
    setTimeout(() => wx.navigateBack(), 1500);
  }
});
