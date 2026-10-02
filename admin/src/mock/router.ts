import { CloudFunctions, type CloudFunctionName, withDelay } from '../api/client';
import type {
  AdminResource,
  AdminUser,
  AuditStatus,
  DashboardStats,
  PageQuery,
  PageResult,
  PaymentReceipt,
} from '../api/types';
import { CONTACT_FIELD_KEYS } from '../config/contactFields';
import { entityResourceConfigs } from '../config/entityFields';
import { addYearsExpireDate, normalizeExpireDate } from '../utils/memberExpire';
import {
  seedBanners,
  seedCommunity,
  seedCompanyApplies,
  seedDirectory,
  seedFactories,
  seedIndustryOrgs,
  seedInfluencers,
  seedMediaServices,
  seedOrders,
  seedProjects,
  seedPublishItems,
  seedStoreDemands,
  seedStoreSupply,
  seedUsers,
  seedMemberPlans,
  seedMemberOrders,
  seedPaymentReceipts,
} from './seed';

function paginate<T>(
  list: T[],
  query: PageQuery,
  filter?: (item: T) => boolean,
): PageResult<T> {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  let filtered = filter ? list.filter(filter) : [...list];
  if (query.keyword) {
    const kw = query.keyword.toLowerCase();
    filtered = filtered.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(kw),
    );
  }
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  return {
    list: filtered.slice(start, start + pageSize),
    total,
    page,
    pageSize,
  };
}

function matchStatus<T extends { status?: string }>(item: T, status?: string) {
  if (!status) return true;
  return item.status === status;
}

const db = {
  companyApplies: [...seedCompanyApplies],
  publishItems: [...seedPublishItems],
  factories: [...seedFactories],
  orders: [...seedOrders],
  storeSupply: [...seedStoreSupply],
  storeDemands: [...seedStoreDemands],
  projects: [...seedProjects],
  influencers: [...seedInfluencers],
  directory: [...seedDirectory],
  industryOrgs: [...seedIndustryOrgs],
  community: [...seedCommunity],
  banners: [...seedBanners],
  mediaServices: [...seedMediaServices],
  users: [...seedUsers],
  memberPlans: seedMemberPlans.map((p) => ({ ...p })),
  memberOrders: [...seedMemberOrders],
  paymentReceipts: [...seedPaymentReceipts],
};

function confirmMemberOrderInDb(orderId: string) {
  const order = db.memberOrders.find((o) => o.id === orderId);
  if (!order) throw new Error('订单不存在');
  if (order.status === 'paid') return;
  order.status = 'paid';
  order.paidAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const user = db.users.find((u) => u.id === order.userId);
  if (user) {
    user.memberLevel = order.level;
    user.memberActive = true;
    user.expireDate =
      normalizeExpireDate(order.expireDate ?? '') || addYearsExpireDate(1);
    order.expireDate = user.expireDate;
  }
  const receipt = db.paymentReceipts.find((r) => r.memberOrderId === orderId);
  if (receipt && receipt.status === 'pending') {
    receipt.status = 'confirmed';
    receipt.paidAt = order.paidAt;
    receipt.confirmedAt = order.paidAt;
  }
}

function monthReceiptTotal() {
  const prefix = new Date().toISOString().slice(0, 7);
  return db.paymentReceipts
    .filter(
      (r) =>
        r.status === 'confirmed' &&
        (r.paidAt?.startsWith(prefix) || r.confirmedAt?.startsWith(prefix)),
    )
    .reduce((sum, r) => sum + r.amount, 0);
}

function applyContactPatch(
  target: Record<string, unknown>,
  patch: Record<string, unknown>,
) {
  CONTACT_FIELD_KEYS.forEach((key) => {
    if (patch[key] !== undefined) target[key] = patch[key];
  });
}

/** Mock：同企业名称/发布方/门店名之间同步联系人、手机、微信 */
function syncContactAcrossModules(item: Record<string, unknown>) {
  const patch: Record<string, unknown> = {};
  CONTACT_FIELD_KEYS.forEach((key) => {
    if (item[key] !== undefined) patch[key] = item[key];
  });
  if (Object.keys(patch).length === 0) return;

  const names = new Set<string>();
  ['name', 'factoryName', 'publisher', 'storeName'].forEach((k) => {
    const v = item[k];
    if (typeof v === 'string' && v.trim()) names.add(v.trim());
  });

  const asRecords = <T,>(list: T[]) => list as unknown as Record<string, unknown>[];
  const pools = [
    asRecords(db.factories),
    asRecords(db.directory),
    asRecords(db.orders),
    asRecords(db.storeSupply),
    asRecords(db.storeDemands),
    asRecords(db.projects),
    asRecords(db.influencers),
    asRecords(db.industryOrgs),
    asRecords(db.publishItems),
    asRecords(db.community),
    asRecords(db.mediaServices),
  ];

  names.forEach((n) => {
    pools.forEach((list) => {
      list.forEach((row) => {
        const r = row as Record<string, unknown>;
        if (
          r.name === n ||
          r.factoryName === n ||
          r.publisher === n ||
          r.storeName === n ||
          r.author === n
        ) {
          applyContactPatch(r, patch);
        }
      });
    });
  });
}

function getResourceList(resource: AdminResource): Record<string, unknown>[] {
  const asRecords = <T,>(list: T[]) => list as unknown as Record<string, unknown>[];
  switch (resource) {
    case 'publish':
      return asRecords(db.publishItems);
    case 'community':
      return asRecords(db.community);
    case 'factories':
      return asRecords(db.factories);
    case 'orders':
      return asRecords(db.orders);
    case 'storeSupply':
      return asRecords(db.storeSupply);
    case 'storeDemands':
      return asRecords(db.storeDemands);
    case 'projects':
      return asRecords(db.projects);
    case 'influencers':
      return asRecords(db.influencers);
    case 'directory':
      return asRecords(db.directory);
    case 'industryOrgs':
      return asRecords(db.industryOrgs);
    case 'banners':
      return asRecords(db.banners);
    case 'mediaServices':
      return asRecords(db.mediaServices);
    default:
      throw new Error(`未知资源: ${resource}`);
  }
}

export async function mockCloudRouter(
  name: CloudFunctionName,
  payload: object,
): Promise<unknown> {
  return withDelay(() => dispatch(name, payload));
}

function dispatch(name: CloudFunctionName, payload: object): unknown {
  const q = payload as PageQuery;
  const p = payload as Record<string, unknown>;

  switch (name) {
    case CloudFunctions.login: {
      const username = String(p.username ?? '');
      const password = String(p.password ?? '');
      if (username === 'admin' && password === 'admin123') {
        const user: AdminUser = {
          id: '1',
          username: 'admin',
          displayName: '超级管理员',
          role: 'super',
        };
        return { token: 'mock-jwt-token', user };
      }
      throw new Error('账号或密码错误（演示：admin / admin123）');
    }

    case CloudFunctions.dashboard: {
      const stats: DashboardStats = {
        pendingCompanyAudit: db.companyApplies.filter((x) => x.status === 'pending').length,
        pendingPublishAudit: db.publishItems.filter((x) => x.status === 'pending').length,
        pendingCommunityAudit: db.community.filter((x) => x.status === 'pending').length,
        totalUsers: db.users.length,
        activeMembers: db.users.filter((u) => u.memberActive && u.memberLevel !== 'free').length,
        pendingMemberOrders: db.memberOrders.filter((o) => o.status === 'pending').length,
        pendingReceipts: db.paymentReceipts.filter((r) => r.status === 'pending').length,
        monthReceiptAmount: monthReceiptTotal(),
        todayVisits: 1284,
        contentCounts: {
          factories: db.factories.length,
          orders: db.orders.length,
          storeSupply: db.storeSupply.length,
          storeDemands: db.storeDemands.length,
          projects: db.projects.length,
          influencers: db.influencers.length,
          directory: db.directory.length,
          industryOrgs: db.industryOrgs.length,
          communityPosts: db.community.length,
        },
      };
      return stats;
    }

    case CloudFunctions.listCompanyApply:
      return paginate(db.companyApplies, q, (item) => matchStatus(item, q.status));

    case CloudFunctions.getCompanyApply: {
      const id = Number(p.id);
      const item = db.companyApplies.find((x) => x.id === id);
      if (!item) throw new Error('申请不存在');
      return { ...item };
    }

    case CloudFunctions.updateCompanyApply: {
      const id = Number(p.id);
      const item = db.companyApplies.find((x) => x.id === id);
      if (!item) throw new Error('申请不存在');
      const fields = [
        'name',
        'type',
        'category',
        'region',
        'contact',
        'phone',
        'wechat',
        'intro',
        'products',
        'auditNote',
        'images',
      ] as const;
      fields.forEach((key) => {
        if (p[key] !== undefined) {
          (item as unknown as Record<string, unknown>)[key] = p[key];
        }
      });
      if (CONTACT_FIELD_KEYS.some((key) => p[key] !== undefined)) {
        syncContactAcrossModules(item as unknown as Record<string, unknown>);
      }
      return { ok: true };
    }

    case CloudFunctions.auditCompany: {
      const id = Number(p.id);
      const status = p.status as AuditStatus;
      const auditNote = p.auditNote as string | undefined;
      const item = db.companyApplies.find((x) => x.id === id);
      if (!item) throw new Error('申请不存在');
      item.status = status;
      if (auditNote) item.auditNote = auditNote;
      if (status === 'approved') {
        db.directory.push({
          id: Date.now(),
          name: item.name,
          type: item.type,
          category: item.category ?? '-',
          region: item.region ?? '-',
          intro: item.intro,
          products: item.products,
          contact: item.contact,
          phone: item.phone,
          wechat: item.wechat ?? '',
          status: 'published',
        });
      }
      return { ok: true };
    }

    case CloudFunctions.listPublish:
      return paginate(db.publishItems, q, (item) => matchStatus(item, q.status));

    case CloudFunctions.getAdminRecord: {
      const resource = String(p.resource) as AdminResource;
      const id = Number(p.id);
      const list = getResourceList(resource);
      const item = list.find((x) => Number(x.id) === id);
      if (!item) throw new Error('记录不存在');
      return { ...item };
    }

    case CloudFunctions.updateAdminRecord: {
      const resource = String(p.resource) as AdminResource;
      const id = Number(p.id);
      const list = getResourceList(resource);
      const item = list.find((x) => Number(x.id) === id);
      if (!item) throw new Error('记录不存在');
      const { editableKeys } = entityResourceConfigs[resource];
      editableKeys.forEach((key) => {
        if (p[key] !== undefined) {
          item[key] = p[key];
        }
      });
      if (CONTACT_FIELD_KEYS.some((key) => p[key] !== undefined)) {
        syncContactAcrossModules(item);
      }
      return { ok: true };
    }

    case CloudFunctions.deleteAdminRecord: {
      const resource = String(p.resource) as AdminResource;
      const id = Number(p.id);
      const list = getResourceList(resource);
      const idx = list.findIndex((x) => Number(x.id) === id);
      if (idx < 0) throw new Error('记录不存在');
      list.splice(idx, 1);
      return { ok: true };
    }

    case CloudFunctions.createAdminRecord: {
      const resource = String(p.resource) as AdminResource;
      const list = getResourceList(resource);
      const cfg = entityResourceConfigs[resource];
      const maxId = list.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0);
      const row: Record<string, unknown> = {
        id: maxId + 1,
        ...(cfg.createInitialValues ?? {}),
      };
      if (resource === 'banners' && row.sort === undefined) {
        row.sort = maxId + 1;
      }
      if (resource === 'factories' && !row.createdAt) {
        row.createdAt = new Date().toISOString().slice(0, 10);
      }
      cfg.editableKeys.forEach((key) => {
        if (p[key] !== undefined) {
          row[key] = p[key];
        }
      });
      if (CONTACT_FIELD_KEYS.some((key) => p[key] !== undefined)) {
        syncContactAcrossModules(row);
      }
      list.unshift(row);
      return { ok: true, id: Number(row.id) };
    }

    case CloudFunctions.auditPublish: {
      const id = Number(p.id);
      const status = p.status as AuditStatus;
      const item = db.publishItems.find((x) => x.id === id);
      if (!item) throw new Error('发布不存在');
      const nextStatus: AuditStatus =
        status === 'approved' ? 'published' : status;
      item.status = nextStatus;

      if (item.type === 'factory_info' && (status === 'approved' || status === 'published')) {
        const row = {
          id: item.id,
          name: item.title,
          category: item.category ?? '—',
          region: item.region ?? '—',
          bizTypes: item.bizTypes?.length ? item.bizTypes : ['OEM贴牌'],
          tags: item.tags ?? [],
          moq: item.moq ?? '面议',
          intro: item.summary ?? item.content ?? '',
          capacity: item.capacity ?? '—',
          cert: item.cert ?? '—',
          samplePolicy: item.samplePolicy ?? '—',
          status: 'published' as AuditStatus,
          publisher: item.publisher,
          createdAt: item.createdAt,
          contact: item.contact,
          phone: item.phone ?? '',
          wechat: item.wechat ?? '',
        };
        const existing = db.factories.find((f) => f.id === item.id);
        if (existing) Object.assign(existing, row);
        else db.factories.unshift(row);
      }

      if (item.type === 'factory_info' && (status === 'offline' || status === 'rejected')) {
        const factory = db.factories.find((f) => f.id === item.id);
        if (factory) factory.status = status;
      }

      if (item.type === 'directory' && (status === 'approved' || status === 'published')) {
        const row = {
          id: item.id,
          name: item.title,
          type: ['工厂', '品牌', '商家'].includes(String(item.category))
            ? String(item.category)
            : '工厂',
          category: item.category ?? '综合',
          region: item.region ?? '全国',
          intro: item.summary ?? item.content,
          products: item.content,
          contact: item.contact,
          phone: item.phone ?? '',
          wechat: item.wechat ?? '',
          status: 'published' as AuditStatus,
        };
        const existing = db.directory.find((d) => d.id === item.id);
        if (existing) Object.assign(existing, row);
        else db.directory.unshift(row);
      }

      if (item.type === 'industry' && (status === 'approved' || status === 'published')) {
        const orgType: '产业园' | '商协会' =
          item.orgType === '商协会' ? '商协会' : '产业园';
        const row = {
          id: item.id,
          name: item.title,
          type: orgType,
          region: item.region ?? '全国',
          scale: item.moq ?? item.summary ?? '—',
          intro: item.summary ?? item.content,
          products: item.content,
          cert: item.cert ?? '—',
          contact: item.contact,
          phone: item.phone ?? '',
          wechat: item.wechat ?? '',
          status: 'published' as AuditStatus,
        };
        const existing = db.industryOrgs.find((d) => d.id === item.id);
        if (existing) Object.assign(existing, row);
        else db.industryOrgs.unshift(row);
      }

      if (
        (item.type === 'directory' || item.type === 'industry') &&
        (status === 'offline' || status === 'rejected')
      ) {
        const dir = db.directory.find((d) => d.id === item.id);
        if (dir) dir.status = status;
        const org = db.industryOrgs.find((d) => d.id === item.id);
        if (org) org.status = status;
      }

      return { ok: true };
    }

    case CloudFunctions.listUsers:
      return paginate(db.users, q);

    case CloudFunctions.listPaidMembers:
      return paginate(db.users, q, (u) => {
        if (q.memberLevel) return u.memberLevel === q.memberLevel;
        return u.memberLevel !== 'free';
      });

    case CloudFunctions.updateUserMembership: {
      const userId = String(p.userId);
      const user = db.users.find((u) => u.id === userId);
      if (!user) throw new Error('用户不存在');
      const level = p.level as typeof user.memberLevel;
      const active = Boolean(p.active);
      user.memberLevel = level;
      user.memberActive = active && level !== 'free';
      if (p.expireDate) {
        user.expireDate = normalizeExpireDate(String(p.expireDate)) || String(p.expireDate);
      }
      if (!user.memberActive) user.memberLevel = 'free';
      return { ok: true };
    }

    case CloudFunctions.listMemberPlans:
      return {
        list: [...db.memberPlans].sort((a, b) => a.sort - b.sort),
        total: db.memberPlans.length,
        page: 1,
        pageSize: db.memberPlans.length,
      };

    case CloudFunctions.updateMemberPlan: {
      const level = String(p.level);
      const plan = db.memberPlans.find((x) => x.level === level);
      if (!plan) throw new Error('套餐不存在');
      if (p.price !== undefined) plan.price = Number(p.price);
      if (p.enabled !== undefined) plan.enabled = Boolean(p.enabled);
      if (p.publishLimit !== undefined) plan.publishLimit = Number(p.publishLimit);
      if (p.name !== undefined) plan.name = String(p.name);
      return { ok: true };
    }

    case CloudFunctions.listMemberOrders:
      return paginate(db.memberOrders, q, (o) => {
        if (!q.status) return true;
        return o.status === q.status;
      });

    case CloudFunctions.confirmMemberOrder: {
      confirmMemberOrderInDb(String(p.id));
      return { ok: true };
    }

    case CloudFunctions.listPaymentReceipts:
      return paginate(db.paymentReceipts, q, (r) => {
        if (q.status && r.status !== q.status) return false;
        if (q.receiptBizType && r.bizType !== q.receiptBizType) return false;
        return true;
      });

    case CloudFunctions.getPaymentReceipt: {
      const id = String(p.id);
      const item = db.paymentReceipts.find((r) => r.id === id);
      if (!item) throw new Error('收款单不存在');
      return { ...item };
    }

    case CloudFunctions.createPaymentReceipt: {
      const amount = Number(p.amount);
      if (!amount || amount <= 0) throw new Error('请输入有效金额');
      const bizTitle = String(p.bizTitle ?? '').trim();
      const payerName = String(p.payerName ?? '').trim();
      if (!bizTitle || !payerName) throw new Error('请填写业务说明与付款方');
      const id = `pr_manual_${Date.now()}`;
      const receiptNo = `SK${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(db.paymentReceipts.length + 1).padStart(4, '0')}`;
      const row = {
        id,
        receiptNo,
        bizType: (p.bizType as PaymentReceipt['bizType']) ?? 'other',
        bizTitle,
        payerName,
        payerUserId: p.payerUserId ? String(p.payerUserId) : undefined,
        amount,
        payChannel: (p.payChannel as PaymentReceipt['payChannel']) ?? 'transfer',
        status: 'pending' as const,
        remark: p.remark ? String(p.remark) : undefined,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      db.paymentReceipts.unshift(row);
      return { id, receiptNo };
    }

    case CloudFunctions.confirmPaymentReceipt: {
      const id = String(p.id);
      const receipt = db.paymentReceipts.find((r) => r.id === id);
      if (!receipt) throw new Error('收款单不存在');
      if (receipt.status !== 'pending') throw new Error('当前状态不可确认');
      const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
      receipt.status = 'confirmed';
      receipt.paidAt = now;
      receipt.confirmedAt = now;
      if (p.remark) receipt.remark = String(p.remark);
      if (receipt.memberOrderId) {
        confirmMemberOrderInDb(receipt.memberOrderId);
      }
      return { ok: true };
    }

    case CloudFunctions.refundPaymentReceipt: {
      const id = String(p.id);
      const receipt = db.paymentReceipts.find((r) => r.id === id);
      if (!receipt) throw new Error('收款单不存在');
      if (receipt.status !== 'confirmed') throw new Error('仅已确认收款可退款');
      receipt.status = 'refunded';
      if (p.remark) receipt.remark = String(p.remark);
      if (receipt.memberOrderId) {
        const order = db.memberOrders.find((o) => o.id === receipt.memberOrderId);
        if (order) order.status = 'refunded';
      }
      return { ok: true };
    }

    case CloudFunctions.listFactories:
      return paginate(db.factories, q, (item) => matchStatus(item, q.status));

    case CloudFunctions.updateFactory:
      return { ok: true, message: 'Mock：已记录操作，接入云函数后写入数据库' };

    case CloudFunctions.deleteFactory: {
      const id = Number(p.id);
      const idx = db.factories.findIndex((x) => x.id === id);
      if (idx < 0) throw new Error('记录不存在');
      db.factories.splice(idx, 1);
      return { ok: true };
    }

    case CloudFunctions.listOrders:
      return paginate(db.orders, q, (item) => matchStatus(item, q.status));

    case CloudFunctions.listStoreSupply:
      return paginate(db.storeSupply, q, (item) => matchStatus(item, q.status));

    case CloudFunctions.listStoreDemands:
      return paginate(db.storeDemands, q, (item) => matchStatus(item, q.status));

    case CloudFunctions.listProjects:
      return paginate(db.projects, q, (item) => matchStatus(item, q.status));

    case CloudFunctions.listInfluencers:
      return paginate(db.influencers, q, (item) => matchStatus(item, q.status));

    case CloudFunctions.listDirectory:
      return paginate(db.directory, q, (item) => matchStatus(item, q.status));

    case CloudFunctions.listIndustryOrgs:
      return paginate(db.industryOrgs, q, (item) => matchStatus(item, q.status));

    case CloudFunctions.listCommunity:
      return paginate(db.community, q, (item) => matchStatus(item, q.status));

    case CloudFunctions.auditCommunity: {
      const id = Number(p.id);
      const status = p.status as AuditStatus;
      const item = db.community.find((x) => x.id === id);
      if (!item) throw new Error('帖子不存在');
      item.status = status;
      return { ok: true };
    }

    case CloudFunctions.deleteCommunity: {
      const id = Number(p.id);
      const idx = db.community.findIndex((x) => x.id === id);
      if (idx < 0) throw new Error('帖子不存在');
      db.community.splice(idx, 1);
      return { ok: true };
    }

    case CloudFunctions.setCommunityInfoHidden: {
      const id = Number(p.id);
      const hidden = Boolean(p.hidden);
      const item = db.community.find((x) => x.id === id);
      if (!item) throw new Error('帖子不存在');
      item.infoHidden = hidden;
      return { ok: true };
    }

    case CloudFunctions.listBanners:
      return paginate(db.banners, q);

    case CloudFunctions.saveBanner:
      return { ok: true };

    case CloudFunctions.uploadImage: {
      const dataUrl = String(p.dataUrl ?? '');
      if (!dataUrl.startsWith('data:image/')) {
        throw new Error('无效的图片数据');
      }
      if (dataUrl.length > 3_000_000) {
        throw new Error('图片过大，请压缩后重试');
      }
      return { url: dataUrl };
    }

    case CloudFunctions.listMediaServices:
      return paginate(db.mediaServices, q);

    default:
      throw new Error(`未实现的云函数: ${name}`);
  }
}
