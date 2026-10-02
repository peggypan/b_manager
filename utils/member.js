/**
 * 会员权限管理
 * @description 核心逻辑：免费用户只能看简介，会员解锁联系方式
 */

const {
  addYearsExpireDate,
  formatExpireLabel,
  isExpireDatePast,
  normalizeExpireDate,
} = require('./memberExpire');

/** 会员等级配置 */
const MEMBER_PLANS = [
  {
    level: 'basic',
    name: '基础会员',
    price: 365,
    unit: '年',
    target: '小型工厂、新品牌、初创商家',
    features: [
      '全平台查看所有企业、项目、达人联系方式',
      '可发布 3 条供需信息',
      '黄页基础展示，普通搜索排序',
      '在线沟通无限次'
    ]
  },
  {
    level: 'advanced',
    name: '高级会员',
    price: 980,
    unit: '年',
    target: '中型工厂、成熟宠物品牌、产业园',
    features: [
      '包含基础会员全部权益',
      '最多发布 15 条供需信息',
      '企业黄页、供需信息加权排名',
      '首页推荐曝光 1 次/季度',
      '平台每周行业供需资讯推送'
    ],
    recommend: true
  },
  {
    level: 'vip',
    name: 'VIP会员',
    price: 2680,
    unit: '年',
    target: '头部工厂、大品牌、优质融资项目方',
    features: [
      '高级会员全部权益',
      '供需发布不限条数',
      '信息置顶每月 1 次（7天）',
      '平台商务辅助对接（人工撮合）',
      '新媒体服务套餐 9 折优惠'
    ]
  }
];

/** 各等级发布条数上限，-1 表示不限 */
const PUBLISH_LIMIT = { free: 0, basic: 3, advanced: 15, vip: -1 };

/**
 * 获取当前会员信息
 * @returns {{ level: string, active: boolean, expireDate: string, expireLabel: string, planName: string }}
 */
const getMembership = () => {
  const m = wx.getStorageSync('membership') || { level: 'free', active: false, expireDate: '' };
  const plan = MEMBER_PLANS.find(p => p.level === m.level);
  const expireDate = normalizeExpireDate(m.expireDate);
  return {
    ...m,
    expireDate,
    expireLabel: formatExpireLabel(expireDate),
    planName: plan ? plan.name : '免费用户',
  };
};

/**
 * 是否为有效会员
 * @returns {boolean}
 */
const isMember = () => {
  const m = getMembership();
  if (!m.active) return false;
  if (m.expireDate && isExpireDatePast(m.expireDate)) return false;
  return m.level !== 'free';
};

/**
 * 获取发布条数上限
 * @returns {number} -1 表示不限
 */
const getPublishLimit = () => {
  const m = getMembership();
  if (!m.active) return PUBLISH_LIMIT.free;
  return PUBLISH_LIMIT[m.level] ?? PUBLISH_LIMIT.free;
};

/**
 * 引导开通会员
 * @param {string} tip - 提示文案
 */
const promptUpgrade = (tip) => {
  wx.showModal({
    title: '开通会员',
    content: tip || '免费用户无法查看联系方式，开通会员即可解锁全平台B端资源',
    confirmText: '去开通',
    success: (res) => {
      if (res.confirm) wx.navigateTo({ url: '/pages/member/member' });
    }
  });
};

/**
 * 模拟开通会员
 * @param {string} level - 会员等级 basic/advanced/vip
 */
const activateMembership = (level) => {
  wx.setStorageSync('membership', {
    level,
    active: true,
    expireDate: addYearsExpireDate(1),
  });
};

module.exports = {
  MEMBER_PLANS,
  PUBLISH_LIMIT,
  getMembership,
  isMember,
  getPublishLimit,
  promptUpgrade,
  activateMembership
};
