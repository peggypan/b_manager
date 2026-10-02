import type { MemberLevel, MemberPlanConfig } from '../api/types';

/** 与小程序 utils/member.js 默认套餐一致 */
export const defaultMemberPlans: MemberPlanConfig[] = [
  {
    level: 'basic',
    name: '基础会员',
    price: 365,
    unit: '年',
    target: '小型工厂、新品牌、初创商家',
    features: [
      '全平台查看企业/项目/达人联系方式',
      '可发布 3 条供需信息',
      '黄页基础展示，普通搜索排序',
      '在线沟通无限次',
    ],
    publishLimit: 3,
    enabled: true,
    sort: 1,
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
      '平台每周行业供需资讯推送',
    ],
    publishLimit: 15,
    recommend: true,
    enabled: true,
    sort: 2,
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
      '新媒体服务套餐 9 折优惠',
    ],
    publishLimit: -1,
    enabled: true,
    sort: 3,
  },
];

export const memberLevelLabels: Record<MemberLevel, string> = {
  free: '免费用户',
  basic: '基础会员',
  advanced: '高级会员',
  vip: 'VIP会员',
};
