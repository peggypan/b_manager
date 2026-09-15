const PROFILE_KEY = 'userProfile';
const DEFAULT_NICKNAME = '宠业用户';

const getUserProfile = () => {
  const profile = wx.getStorageSync(PROFILE_KEY) || {};
  return {
    avatar: profile.avatar || '',
    nickname: profile.nickname || DEFAULT_NICKNAME
  };
};

const saveUserProfile = (profile) => {
  const current = getUserProfile();
  wx.setStorageSync(PROFILE_KEY, { ...current, ...profile });
};

const getDisplayName = () => getUserProfile().nickname;

module.exports = {
  getUserProfile,
  saveUserProfile,
  getDisplayName,
  DEFAULT_NICKNAME
};
