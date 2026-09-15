Component({
  properties: {
    images: { type: Array, value: [] },
    videoUrl: { type: String, value: '' },
    videoPoster: { type: String, value: '' },
    imageTitle: { type: String, value: '图片资料' },
    videoTitle: { type: String, value: '视频资料' }
  },

  methods: {
    previewImage(e) {
      wx.previewImage({
        current: e.currentTarget.dataset.url,
        urls: this.data.images
      });
    }
  }
});
