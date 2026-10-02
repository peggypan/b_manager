const mock = require('../../services/mock');
const {
  getPostById,
  getComments,
  addComment,
  deleteComment,
  deletePost,
  isUserPostId,
  isLiked,
  toggleLike,
  isFollowing,
  toggleFollow,
} = require('../../utils/community');
const { getUserProfile } = require('../../utils/userProfile');
const { showToast } = require('../../utils/util');

Page({
  data: {
    post: null,
    comments: [],
    liked: false,
    followed: false,
    likeCount: 0,
    inputText: '',
    commentImage: '',
    showEmoji: false,
    emojis: mock.COMMUNITY_EMOJIS,
    scrollTo: '',
    replyTo: null,
    inputFocus: false,
    canDeletePost: false,
    myNickname: '',
  },

  onLoad(options) {
    const post = getPostById(options.id);
    if (!post) return;
    this.postId = post.id;
    const profile = getUserProfile();
    this.setData({
      post,
      liked: isLiked(post.id),
      followed: isFollowing(post.author),
      likeCount: post.likes || 0,
      canDeletePost: isUserPostId(post.id),
      myNickname: profile.nickname,
    });
    this.seedDemoComments();
    wx.setNavigationBarTitle({ title: post.title.slice(0, 12) });
    this.loadComments();
    this.enableShare();
  },

  onShow() {
    this.enableShare();
  },

  enableShare() {
    wx.showShareMenu({
      withShareTicket: false,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  getSharePayload() {
    const { post } = this.data;
    if (!post) return null;
    const imageUrl = post.cover || (post.images && post.images[0]) || '';
    return {
      title: post.title,
      path: `/pages/community-detail/community-detail?id=${post.id}`,
      imageUrl
    };
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
    const nickname = this.data.myNickname || getUserProfile().nickname;
    const comments = getComments(this.postId).map((c) => ({
      ...c,
      isMine: c.author === nickname,
    }));
    this.setData({
      comments,
      scrollTo: comments.length ? `c${comments.length - 1}` : '',
    });
  },

  confirmDeletePost() {
    wx.showModal({
      title: '删除笔记',
      content: '删除后无法恢复，确定删除吗？',
      success: (res) => {
        if (!res.confirm) return;
        deletePost(this.postId);
        showToast('已删除');
        setTimeout(() => wx.navigateBack(), 600);
      },
    });
  },

  confirmDeleteComment(e) {
    const commentId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除评论',
      content: '确定删除这条评论吗？',
      success: (res) => {
        if (!res.confirm) return;
        deleteComment(this.postId, commentId);
        this.loadComments();
        showToast('已删除');
      },
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

  toggleFollowAuthor() {
    const { post } = this.data;
    if (!post) return;
    const followed = toggleFollow(post.author);
    this.setData({ followed });
    showToast(followed ? '已关注' : '已取消关注');
  },

  onShareAppMessage() {
    const payload = this.getSharePayload();
    return payload || { title: '宠投投 · 宠业社区', path: '/pages/community/community' };
  },

  onShareTimeline() {
    const payload = this.getSharePayload();
    if (!payload) return { title: '宠投投 · 宠业社区' };
    return {
      title: payload.title,
      query: `id=${this.postId}`,
      imageUrl: payload.imageUrl
    };
  },

  replyToComment(e) {
    const { id, author } = e.currentTarget.dataset;
    this.setData({
      replyTo: { id: Number(id), author },
      inputFocus: false
    });
    this.setData({ inputFocus: true, showEmoji: false });
  },

  cancelReply() {
    this.setData({ replyTo: null, inputFocus: false });
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
    const { inputText, commentImage, replyTo } = this.data;
    if (!inputText.trim() && !commentImage) return showToast('请输入评论或选择图片');

    const profile = getUserProfile();

    addComment(this.postId, {
      id: Date.now(),
      author: profile.nickname,
      avatar: profile.avatar || `https://picsum.photos/seed/c${Date.now()}/100/100`,
      content: inputText.trim(),
      images: commentImage ? [commentImage] : [],
      time: '刚刚',
      replyToId: replyTo ? replyTo.id : null,
      replyToAuthor: replyTo ? replyTo.author : ''
    });

    this.setData({
      inputText: '',
      commentImage: '',
      showEmoji: false,
      replyTo: null,
      inputFocus: false,
      likeCount: this.data.likeCount,
      'post.comments': (this.data.post.comments || 0) + 1
    });
    this.loadComments();
  }
});
