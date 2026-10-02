/**
 * 后台表单灰色提示文案，与小程序 `services/mock.js`、发布页 placeholder 对齐。
 * 仅作 Input placeholder 展示，不作为预填值（避免黑色正文误导）。
 */
import type { AdminResource } from '../api/types';

/** 各模块字段灰色提示（新增 / 修改时空白项均显示） */
export const createFormFieldHints: Partial<Record<AdminResource, Record<string, string>>> = {
  publish: {
    title: '成犬粮 OEM贴牌方案',
    publisher: '会员昵称 / 企业简称',
    summary: '一句话摘要，展示在列表卡片',
    content: '详细说明、合作条件、交付周期等',
    category: '主粮',
    region: '山东烟台',
    moq: '500kg',
    bizTypes: '现货批发、OEM贴牌',
    tags: '可打样、支持贴牌',
    capacity: '月产2000吨',
    cert: 'ISO9001、HACCP',
    samplePolicy: '免费打样3kg',
    contact: '王厂长',
    phone: '0535-8881234',
    wechat: 'chongan_factory',
    auditNote: '内部审核备注（C 端不可见）',
  },
  community: {
    category: '行业动态',
    title: '2026宠业风向标：猫经济持续领跑',
    author: '宠业观察',
    content: '正文内容，支持多段描述与换行',
    contact: '联系人（选填）',
    phone: '手机号或座机',
    wechat: '微信号',
    auditNote: '内部审核备注',
  },
  factories: {
    name: '宠安食品工厂',
    category: '主粮',
    region: '山东烟台',
    bizTypes: '现货批发、OEM贴牌',
    tags: '可打样、支持贴牌',
    moq: '500kg',
    intro: '专注宠物主粮OEM/ODM代工15年，月产能2000吨，支持贴牌与打样',
    capacity: '月产2000吨',
    cert: 'ISO9001、HACCP',
    samplePolicy: '免费打样3kg',
    publisher: '平台录入',
    contact: '王厂长',
    phone: '0535-8881234',
    wechat: 'chongan_factory',
  },
  orders: {
    factoryName: '宠安食品工厂',
    title: '成犬粮 OEM贴牌方案',
    type: '代工方案',
    category: '主粮',
    moq: '500kg',
    price: '面议',
    contact: '王厂长',
    phone: '0535-8881234',
    wechat: 'chongan_factory',
  },
  storeSupply: {
    name: '鲜肉无谷狗粮 2kg',
    factoryName: '宠安食品工厂',
    category: '主粮',
    origin: '山东',
    price: '28.5',
    contact: '王厂长',
    phone: '0535-8881234',
    wechat: 'chongan_factory',
  },
  storeDemands: {
    title: '求平价猫砂一件代发',
    storeName: '萌宠小屋',
    category: '猫砂',
    region: '上海',
    time: '选择发布日期',
    contact: '店长',
    phone: '13800138001',
    wechat: 'mengchong_store',
  },
  projects: {
    name: '智能宠物健康监测项圈',
    track: '智能硬件',
    stage: 'A轮',
    need: '寻求500万融资；基于IoT的宠物健康监测设备，已获2项专利',
    contact: '融资负责人',
    phone: '13800001111',
    wechat: 'pet_iot_fund',
  },
  influencers: {
    name: '萌宠日记',
    platform: '抖音',
    fans: '128万',
    category: '猫狗日常',
    mode: '分销带货',
    contact: '商务',
    phone: '18600001111',
    wechat: 'mengchong_diary',
  },
  directory: {
    name: '宠安食品工厂',
    category: '主粮/零食',
    region: '山东烟台',
    intro: '15年宠物食品代工经验，服务200+品牌',
    products: '主粮OEM、零食ODM',
    contact: '王厂长',
    phone: '0535-8881234',
    wechat: 'chongan_factory',
  },
  industryOrgs: {
    name: '华南宠物产业园',
    region: '广东佛山',
    scale: '500亩 · 入驻企业80+',
    intro: '集生产、研发、展示于一体的宠物产业集聚地',
    products: '厂房租赁、政策扶持、资源对接、物流配套',
    cert: '省级产业园',
    contact: '园区招商',
    phone: '0757-8889900',
    wechat: 'hn_pet_park',
  },
  banners: {
    sort: '99',
    title: '开通会员 解锁全平台联系方式',
    image: 'https://picsum.photos/seed/bb1/750/320',
    link: '/pages/index/index',
  },
  mediaServices: {
    name: '短视频拍摄套餐',
    price: '3000起',
    desc: '含脚本、拍摄、剪辑、发布指导',
    image: 'https://picsum.photos/seed/media1/600/400',
    contact: '商务',
    phone: '400-888-1001',
    wechat: 'media_short_video',
  },
};

const sharedContactHints: Record<string, string> = {
  contact: '商务对接联系人',
  phone: '手机号或座机',
  wechat: '用于商务对接的微信号',
};

/** 新增时仅写入开关、状态等，文本字段留空以显示灰色 placeholder */
const createStructuralDefaults: Partial<Record<AdminResource, Record<string, unknown>>> = {
  factories: { status: 'published' },
  orders: { status: 'published' },
  storeSupply: { status: 'published', dropship: true },
  storeDemands: { status: 'published' },
  projects: { status: 'published' },
  influencers: { status: 'published' },
  directory: { status: 'published', type: '工厂' },
  industryOrgs: { status: 'published', type: '产业园' },
  banners: { enabled: true },
  mediaServices: { enabled: true },
};

export function getCreateInitialValues(resource: AdminResource): Record<string, unknown> {
  return { ...(createStructuralDefaults[resource] ?? {}) };
}

export function getFieldHint(
  resource: AdminResource,
  fieldKey: string,
  fieldPlaceholder?: string,
): string | undefined {
  return fieldPlaceholder ?? createFormFieldHints[resource]?.[fieldKey] ?? sharedContactHints[fieldKey];
}
