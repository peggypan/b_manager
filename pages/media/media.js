Page({
  onLoad(options) {
    const tab = options.tab === 'influencer' ? 'influencer' : 'service';
    wx.redirectTo({ url: `/pages/invest/invest?tab=${tab}` });
  }
});
