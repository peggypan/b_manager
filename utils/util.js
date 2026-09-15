/**
 * 通用工具函数
 */

const showToast = (title, icon = 'none') => {
  wx.showToast({ title, icon, duration: 2000 });
};

const formatDate = (date, fmt = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const map = {
    YYYY: d.getFullYear(),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    DD: String(d.getDate()).padStart(2, '0')
  };
  return fmt.replace(/YYYY|MM|DD/g, (k) => map[k]);
};

/**
 * 拨打电话（会员权限校验后调用）
 * @param {string} phone
 */
const callPhone = (phone) => {
  wx.makePhoneCall({ phoneNumber: phone });
};

/**
 * 复制微信号
 * @param {string} wechat
 */
const copyWechat = (wechat) => {
  wx.setClipboardData({
    data: wechat,
    success: () => showToast('微信号已复制')
  });
};

/**
 * 切换收藏
 * @param {string} type - 收藏类型
 * @param {string|number} id - 资源 ID
 * @returns {boolean} 当前是否已收藏
 */
const toggleFavorite = (type, id) => {
  const key = 'favorites';
  const list = wx.getStorageSync(key) || [];
  const idx = list.findIndex(f => f.type === type && f.id === id);
  if (idx >= 0) {
    list.splice(idx, 1);
    wx.setStorageSync(key, list);
    return false;
  }
  list.push({ type, id, time: Date.now() });
  wx.setStorageSync(key, list);
  return true;
};

const isFavorite = (type, id) => {
  const list = wx.getStorageSync('favorites') || [];
  return list.some(f => f.type === type && f.id === id);
};

module.exports = {
  showToast,
  formatDate,
  callPhone,
  copyWechat,
  toggleFavorite,
  isFavorite
};
