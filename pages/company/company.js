Page({
  data: {
    company: {},
    statusMap: { none: '未入驻', pending: '审核中', approved: '已通过', rejected: '已驳回' }
  },

  onShow() {
    this.setData({ company: wx.getStorageSync('company') || { status: 'none' } });
  },

  goApply() {
    wx.navigateTo({ url: '/pages/directory-apply/directory-apply' });
  }
});
