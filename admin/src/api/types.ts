/** 与小程序云数据库集合 / 云函数约定对齐的类型（预留） */

/** 与小程序 status 对齐：published 表示 C 端已展示（免审或已通过） */
export type AuditStatus = 'pending' | 'approved' | 'published' | 'rejected' | 'offline';
/** 后台通用 get/update 记录资源键（Mock 与云函数对齐） */
export type EntityModalMode = 'view' | 'edit' | 'create';

export type AdminResource =
  | 'publish'
  | 'community'
  | 'factories'
  | 'orders'
  | 'storeSupply'
  | 'storeDemands'
  | 'projects'
  | 'influencers'
  | 'directory'
  | 'industryOrgs'
  | 'banners'
  | 'mediaServices';

export type PublishType =
  | 'factory'
  | 'factory_info'
  | 'order'
  | 'order_demand'
  | 'invest'
  | 'storeSupply'
  | 'storeDemand'
  | 'directory'
  | 'industry'
  | 'community';

export type MemberLevel = 'free' | 'basic' | 'advanced' | 'vip';
export type MemberOrderStatus = 'paid' | 'pending' | 'refunded' | 'closed';
export type PayChannel = 'wechat' | 'manual' | 'transfer';

/** 收款单业务类型 */
export type ReceiptBizType = 'membership' | 'media_service' | 'deposit' | 'other';
/** 收款单状态 */
export type ReceiptStatus = 'pending' | 'confirmed' | 'refunded' | 'cancelled';

export interface PageQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: AuditStatus | MemberOrderStatus | ReceiptStatus | '';
  memberLevel?: MemberLevel | '';
  receiptBizType?: ReceiptBizType | '';
}

export interface MemberPlanConfig {
  level: Exclude<MemberLevel, 'free'>;
  name: string;
  price: number;
  unit: string;
  target: string;
  features: string[];
  publishLimit: number;
  recommend?: boolean;
  enabled: boolean;
  sort: number;
}

export interface PaymentReceipt {
  id: string;
  receiptNo: string;
  bizType: ReceiptBizType;
  bizTitle: string;
  payerName: string;
  payerUserId?: string;
  amount: number;
  payChannel: PayChannel;
  status: ReceiptStatus;
  /** 关联付费会员订单 id */
  memberOrderId?: string;
  paidAt?: string;
  confirmedAt?: string;
  remark?: string;
  createdAt: string;
}

export interface MemberOrder {
  id: string;
  orderNo: string;
  userId: string;
  nickname: string;
  level: MemberLevel;
  planName: string;
  amount: number;
  payChannel: PayChannel;
  status: MemberOrderStatus;
  paidAt?: string;
  expireDate?: string;
  createdAt: string;
  remark?: string;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DashboardStats {
  pendingCompanyAudit: number;
  pendingPublishAudit: number;
  pendingCommunityAudit: number;
  totalUsers: number;
  activeMembers: number;
  pendingMemberOrders: number;
  pendingReceipts: number;
  monthReceiptAmount: number;
  todayVisits: number;
  contentCounts: {
    factories: number;
    orders: number;
    storeSupply: number;
    storeDemands: number;
    projects: number;
    influencers: number;
    directory: number;
    industryOrgs: number;
    communityPosts: number;
  };
}

export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  role: 'super' | 'operator' | 'auditor';
}

export interface WxUser {
  id: string;
  openid: string;
  nickname: string;
  phone?: string;
  avatar?: string;
  memberLevel: MemberLevel;
  memberActive: boolean;
  /** 会员到期日 YYYY-MM-DD（与小程序 membership.expireDate 一致） */
  expireDate?: string;
  createdAt: string;
}

export interface CompanyApply {
  id: number;
  name: string;
  type: string;
  category?: string;
  region?: string;
  contact: string;
  phone: string;
  wechat: string;
  intro?: string;
  products?: string;
  images?: string[];
  videoUrl?: string;
  videoPoster?: string;
  status: AuditStatus;
  applyTime: string;
  auditNote?: string;
}

export interface PublishItem {
  id: number;
  type: PublishType;
  title: string;
  publisher: string;
  status: AuditStatus;
  createdAt: string;
  summary?: string;
  content?: string;
  /** 工厂信息 / 需求类扩展字段（与小程序 localPublish 结构对齐） */
  category?: string;
  region?: string;
  moq?: string;
  bizTypes?: string[];
  tags?: string[];
  capacity?: string;
  cert?: string;
  samplePolicy?: string;
  /** 产业园 / 商协会（type=industry 时） */
  orgType?: '产业园' | '商协会';
  contact?: string;
  phone?: string;
  wechat?: string;
  auditNote?: string;
}

export interface BannerItem {
  id: number;
  image: string;
  title: string;
  link?: string;
  sort: number;
  enabled: boolean;
}

export interface CommunityPostAdmin {
  id: number;
  category: string;
  title: string;
  author: string;
  status: AuditStatus;
  likes: number;
  comments: number;
  time: string;
  content?: string;
  contact?: string;
  phone?: string;
  wechat?: string;
  auditNote?: string;
  /** 对小程序端隐藏作者及正文内联系方式等敏感信息 */
  infoHidden?: boolean;
}

export interface FactoryItem {
  id: number;
  name: string;
  category: string;
  region: string;
  bizTypes: string[];
  tags?: string[];
  moq: string;
  intro?: string;
  capacity?: string;
  cert?: string;
  samplePolicy?: string;
  status: AuditStatus;
  publisher?: string;
  createdAt?: string;
  contact?: string;
  phone: string;
  wechat: string;
}

export interface OrderSchemeItem {
  id: number;
  factoryName: string;
  title: string;
  type: string;
  category: string;
  moq: string;
  price: string;
  status: AuditStatus;
  contact?: string;
  phone?: string;
  wechat?: string;
}

export interface StoreSupplyItem {
  id: number;
  name: string;
  factoryName: string;
  category: string;
  origin: string;
  price: number;
  dropship: boolean;
  status: AuditStatus;
  contact?: string;
  phone?: string;
  wechat?: string;
}

export interface StoreDemandItem {
  id: number;
  title: string;
  storeName: string;
  category: string;
  region: string;
  time: string;
  status: AuditStatus;
  contact?: string;
  phone?: string;
  wechat?: string;
}

export interface InvestProjectItem {
  id: number;
  name: string;
  track: string;
  stage: string;
  need: string;
  status: AuditStatus;
  contact?: string;
  phone?: string;
  wechat?: string;
}

export interface InfluencerItem {
  id: number;
  name: string;
  platform: string;
  fans: string;
  category: string;
  mode: string;
  status: AuditStatus;
  contact?: string;
  phone?: string;
  wechat?: string;
}

export interface DirectoryCompanyItem {
  id: number;
  name: string;
  type: string;
  category: string;
  region: string;
  intro?: string;
  products?: string;
  status: AuditStatus;
  contact?: string;
  phone?: string;
  wechat?: string;
}

export interface IndustryOrgItem {
  id: number;
  name: string;
  type: '产业园' | '商协会';
  region: string;
  scale?: string;
  intro?: string;
  products?: string;
  cert?: string;
  status: AuditStatus;
  contact?: string;
  phone?: string;
  wechat?: string;
}

export interface MediaServiceItem {
  id: number;
  name: string;
  price: string;
  desc: string;
  /** 套餐封面，小程序创投页「推广服务」卡片展示 */
  image?: string;
  enabled: boolean;
  contact?: string;
  phone?: string;
  wechat?: string;
}
