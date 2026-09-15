const { showToast } = require('../../utils/util');

Component({
  properties: {
    maxImages: { type: Number, value: 3 },
    imageLabel: { type: String, value: '上传图片' },
    videoLabel: { type: String, value: '上传视频' },
    showImage: { type: Boolean, value: true },
    showVideo: { type: Boolean, value: true }
  },

  data: {
    images: [],
    videoPath: '',
    videoThumb: ''
  },

  methods: {
    emitChange() {
      this.triggerEvent('change', {
        images: this.data.images,
        videoPath: this.data.videoPath,
        videoThumb: this.data.videoThumb
      });
    },

    chooseImage() {
      const remaining = this.properties.maxImages - this.data.images.length;
      if (remaining <= 0) return showToast(`最多上传${this.properties.maxImages}张图片`);
      wx.chooseMedia({
        count: remaining,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const newImages = res.tempFiles.map(f => f.tempFilePath);
          this.setData({
            images: [...this.data.images, ...newImages].slice(0, this.properties.maxImages)
          }, () => this.emitChange());
        }
      });
    },

    chooseVideo() {
      wx.chooseMedia({
        count: 1,
        mediaType: ['video'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const file = res.tempFiles[0];
          this.setData({
            videoPath: file.tempFilePath,
            videoThumb: file.thumbTempFilePath || ''
          }, () => this.emitChange());
        }
      });
    },

    previewImage(e) {
      wx.previewImage({
        current: e.currentTarget.dataset.url,
        urls: this.data.images
      });
    },

    removeImage(e) {
      const images = [...this.data.images];
      images.splice(e.currentTarget.dataset.index, 1);
      this.setData({ images }, () => this.emitChange());
    },

    removeVideo() {
      this.setData({ videoPath: '', videoThumb: '' }, () => this.emitChange());
    }
  }
});
