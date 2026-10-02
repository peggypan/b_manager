const mock = require('../../services/mock');
const { savePost, updatePost, getUserPostById } = require('../../utils/community');
const { getUserProfile } = require('../../utils/userProfile');
const { showToast } = require('../../utils/util');

Page({
  data: {
    editId: null,
    categories: mock.COMMUNITY_TABS.filter((t) => t !== '推荐'),
    category: '交流',
    title: '',
    content: '',
    tags: '',
    images: [],
    videoPath: '',
    videoThumb: '',
  },

  onLoad(options) {
    const editId = options.id ? Number(options.id) : null;
    if (!editId) return;
    const post = getUserPostById(editId);
    if (!post) {
      showToast('笔记不存在或无法编辑');
      return;
    }
    wx.setNavigationBarTitle({ title: '编辑笔记' });
    this.setData({
      editId,
      category: post.category || '交流',
      title: post.title || '',
      content: post.content || '',
      tags: (post.tags || []).join(' '),
      images: post.images || [],
      videoPath: post.videoUrl || '',
      videoThumb: post.videoPoster || '',
    });
  },

  onInput(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value });
  },

  selectCategory(e) {
    this.setData({ category: this.data.categories[e.detail.value] });
  },

  onMediaChange(e) {
    const { images, videoPath, videoThumb } = e.detail;
    this.setData({ images, videoPath, videoThumb });
  },

  submit() {
    const {
      title,
      content,
      category,
      tags,
      images,
      videoPath,
      videoThumb,
      editId,
    } = this.data;
    if (!content.trim()) return showToast('请填写笔记内容');
    if (!images.length && !videoPath) return showToast('请至少上传一张图片或一个视频');

    const profile = getUserProfile();
    const payload = {
      category,
      title: title.trim() || content.slice(0, 30),
      content: content.trim(),
      author: profile.nickname,
      ownerNickname: profile.nickname,
      avatar: profile.avatar || `https://picsum.photos/seed/u${Date.now()}/100/100`,
      cover: images[0] || videoThumb,
      coverH: 420,
      images,
      videoUrl: videoPath,
      videoPoster: videoThumb,
      tags: tags ? tags.split(/[,，\s]+/).filter(Boolean).slice(0, 5) : [],
      time: '刚刚',
      status: 'published',
    };

    if (editId) {
      updatePost(editId, payload);
      showToast('笔记已更新');
    } else {
      savePost({ id: Date.now(), likes: 0, comments: 0, ...payload });
      showToast('笔记发布成功');
    }
    setTimeout(() => wx.navigateBack(), 1200);
  },
});
