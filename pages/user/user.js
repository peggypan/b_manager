const { getMembership } = require('../../utils/member');
const { getUserProfile, saveUserProfile } = require('../../utils/userProfile');
const { showToast } = require('../../utils/util');

Page({
  data: {
    profile: { avatar: '', nickname: '宠业用户' },
    company: {},
    membership: {},
    editingName: false,
    nicknameInput: '',
    menus: [
      { name: '企业资质管理', icon: '🏢', url: '/pages/company/company' },
      { name: '会员中心', icon: '👑', url: '/pages/member/member' },
      { name: '我的发布', icon: '📝', url: '/pages/publish/publish' },
      { name: '我的收藏', icon: '⭐', url: '/pages/favorites/favorites' },
      { name: '消息中心', icon: '💬', url: '/pages/messages/messages' },
      { name: '服务预约记录', icon: '📋', url: '/pages/media-book/media-book' },
      { name: '企业黄页入驻', icon: '📇', url: '/pages/directory-apply/directory-apply' }
    ]
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4, showPublish: false });
    }
    const company = wx.getStorageSync('company') || { name: '未入驻企业', status: 'none' };
    this.setData({
      company,
      membership: getMembership(),
      profile: getUserProfile()
    });
  },

  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const avatar = res.tempFiles[0].tempFilePath;
        saveUserProfile({ avatar });
        this.setData({ profile: getUserProfile() });
        showToast('头像已更新');
      }
    });
  },

  startEditName() {
    this.setData({
      editingName: true,
      nicknameInput: this.data.profile.nickname
    });
  },

  onNicknameInput(e) {
    this.setData({ nicknameInput: e.detail.value });
  },

  saveNickname() {
    const nickname = (this.data.nicknameInput || '').trim();
    if (!nickname) return showToast('网名不能为空');
    if (nickname.length > 20) return showToast('网名最多20个字');
    saveUserProfile({ nickname });
    this.setData({
      profile: getUserProfile(),
      editingName: false,
      nicknameInput: ''
    });
    showToast('网名已更新');
  },

  cancelEditName() {
    this.setData({ editingName: false, nicknameInput: '' });
  },

  goCompanyApply() {
    wx.navigateTo({ url: '/pages/directory-apply/directory-apply' });
  },

  onMenuTap(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.item.url });
  },

  goMember() {
    wx.navigateTo({ url: '/pages/member/member' });
  }
});
