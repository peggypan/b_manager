const mock = require('../../services/mock');
const { getPostById, getComments, addComment, isLiked, toggleLike } = require('../../utils/community');
const { getUserProfile } = require('../../utils/userProfile');
const { showToast } = require('../../utils/util');

Page({
  data: {
    post: null,
    comments: [],
    liked: false,
    likeCount: 0,
    inputText: '',
    commentImage: '',
    showEmoji: false,
    emojis: mock.COMMUNITY_EMOJIS,
    scrollTo: ''
  },

  onLoad(options) {
    const post = getPostById(options.id);
    if (!post) return;
    this.postId = post.id;
    this.setData({
      post,
      liked: isLiked(post.id),
      likeCount: post.likes || 0
    });
    this.seedDemoComments();
    wx.setNavigationBarTitle({ title: post.title.slice(0, 12) });
    this.loadComments();
  },

  seedDemoComments() {
    if (getComments(this.postId).length) return;
    const seeds = [
      { id: 1, author: '宠业老王', avatar: 'https://picsum.photos/seed/seed1/100/100', content: '很有参考价值，已收藏 📈', images: [], time: '1小时前' },
      { id: 2, author: '工厂小李', avatar: 'https://picsum.photos/seed/seed2/100/100', content: '我们工厂也在关注这个方向', images: [], time: '30分钟前' }
    ];
    seeds.forEach(c => addComment(this.postId, c));
  },

  loadComments() {
    const comments = getComments(this.postId);
    this.setData({
      comments,
      scrollTo: comments.length ? `c${comments.length - 1}` : ''
    });
  },

  previewImage(e) {
    const { url, urls } = e.currentTarget.dataset;
    wx.previewImage({ current: url, urls: urls || [url] });
  },

  toggleLikePost() {
    const liked = toggleLike(this.postId);
    const likeCount = this.data.likeCount + (liked ? 1 : -1);
    this.setData({ liked, likeCount: Math.max(0, likeCount) });
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  toggleEmoji() {
    this.setData({ showEmoji: !this.data.showEmoji });
  },

  pickEmoji(e) {
    this.setData({ inputText: this.data.inputText + e.currentTarget.dataset.emoji });
  },

  chooseCommentImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ commentImage: res.tempFiles[0].tempFilePath, showEmoji: false });
      }
    });
  },

  removeCommentImage() {
    this.setData({ commentImage: '' });
  },

  sendComment() {
    const { inputText, commentImage } = this.data;
    if (!inputText.trim() && !commentImage) return showToast('请输入评论或选择图片');

    const profile = getUserProfile();

    addComment(this.postId, {
      id: Date.now(),
      author: profile.nickname,
      avatar: profile.avatar || `https://picsum.photos/seed/c${Date.now()}/100/100`,
      content: inputText.trim(),
      images: commentImage ? [commentImage] : [],
      time: '刚刚'
    });

    this.setData({
      inputText: '',
      commentImage: '',
      showEmoji: false,
      likeCount: this.data.likeCount,
      'post.comments': (this.data.post.comments || 0) + 1
    });
    this.loadComments();
  }
});
