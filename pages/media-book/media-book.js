const mock = require('../../services/mock');
const { requireContactFields, trim } = require('../../utils/contactForm');
const { showToast } = require('../../utils/util');

Page({
  data: {
    service: null,
    form: { company: '', contact: '', phone: '', wechat: '', demand: '' },
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
    if (!trim(form.company)) {
      showToast('请填写企业名称');
      return;
    }
    const contactErr = requireContactFields(form);
    if (contactErr) {
      showToast(contactErr);
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
  },

  removeBooking(e) {
    const id = Number(e.currentTarget.dataset.id);
    wx.showModal({
      title: '删除预约',
      content: '确定删除这条预约记录吗？',
      success: (res) => {
        if (!res.confirm) return;
        const bookings = (wx.getStorageSync('mediaBookings') || []).filter(
          (b) => Number(b.id) !== id,
        );
        wx.setStorageSync('mediaBookings', bookings);
        this.setData({ bookings });
        showToast('已删除');
      },
    });
  },
});
