/**
 * 统一云函数调用入口
 *
 * 后续接入微信云开发时：
 * 1. 在云函数侧实现与 `CloudFunctions` 同名的 admin 接口
 * 2. 配置 VITE_CLOUD_API_BASE 指向 HTTP 网关，或在小程序同环境使用 @cloudbase/js-sdk
 * 3. 将 VITE_USE_MOCK 设为 false
 *
 * 云函数命名约定：admin.{module}.{action}，例如 admin.audit.approveCompany
 */
export const CloudFunctions = {
  login: 'admin.auth.login',
  dashboard: 'admin.dashboard.stats',
  listCompanyApply: 'admin.audit.listCompanyApply',
  getCompanyApply: 'admin.audit.getCompanyApply',
  updateCompanyApply: 'admin.audit.updateCompanyApply',
  auditCompany: 'admin.audit.auditCompany',
  listPublish: 'admin.audit.listPublish',
  auditPublish: 'admin.audit.auditPublish',
  getAdminRecord: 'admin.common.getRecord',
  updateAdminRecord: 'admin.common.updateRecord',
  deleteAdminRecord: 'admin.common.deleteRecord',
  createAdminRecord: 'admin.common.createRecord',
  listUsers: 'admin.user.list',
  listPaidMembers: 'admin.member.listPaid',
  updateUserMembership: 'admin.member.updateUser',
  listMemberPlans: 'admin.member.listPlans',
  updateMemberPlan: 'admin.member.updatePlan',
  listMemberOrders: 'admin.member.listOrders',
  confirmMemberOrder: 'admin.member.confirmOrder',
  listPaymentReceipts: 'admin.finance.listReceipts',
  getPaymentReceipt: 'admin.finance.getReceipt',
  createPaymentReceipt: 'admin.finance.createReceipt',
  confirmPaymentReceipt: 'admin.finance.confirmReceipt',
  refundPaymentReceipt: 'admin.finance.refundReceipt',
  listFactories: 'admin.content.listFactories',
  updateFactory: 'admin.content.updateFactory',
  deleteFactory: 'admin.content.deleteFactory',
  listOrders: 'admin.content.listOrders',
  listStoreSupply: 'admin.content.listStoreSupply',
  listStoreDemands: 'admin.content.listStoreDemands',
  listProjects: 'admin.content.listProjects',
  listInfluencers: 'admin.content.listInfluencers',
  listDirectory: 'admin.content.listDirectory',
  listIndustryOrgs: 'admin.content.listIndustryOrgs',
  listCommunity: 'admin.content.listCommunity',
  auditCommunity: 'admin.content.auditCommunity',
  deleteCommunity: 'admin.content.deleteCommunity',
  setCommunityInfoHidden: 'admin.content.setCommunityInfoHidden',
  listBanners: 'admin.content.listBanners',
  saveBanner: 'admin.content.saveBanner',
  listMediaServices: 'admin.content.listMediaServices',
  uploadImage: 'admin.storage.uploadImage',
} as const;

export type CloudFunctionName = (typeof CloudFunctions)[keyof typeof CloudFunctions];

export class ApiError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const API_BASE = (import.meta.env.VITE_CLOUD_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '';

type MockHandler = (payload: Record<string, unknown>) => Promise<unknown>;

let mockRouter: ((name: CloudFunctionName, payload: object) => Promise<unknown>) | null = null;

/** Mock 模式下由 mock/db 注册路由 */
export function registerMockRouter(
  router: (name: CloudFunctionName, payload: object) => Promise<unknown>,
) {
  mockRouter = router;
}

export function isMockMode() {
  return USE_MOCK;
}

/**
 * 调用云函数（或 Mock）
 */
export async function callCloud<T>(
  name: CloudFunctionName,
  payload: object = {},
): Promise<T> {
  if (USE_MOCK) {
    if (!mockRouter) {
      throw new ApiError(500, 'Mock 路由未初始化');
    }
    const data = (await mockRouter(name, payload)) as T;
    return data;
  }

  if (!API_BASE) {
    throw new ApiError(503, '请配置 VITE_CLOUD_API_BASE 或开启 VITE_USE_MOCK');
  }

  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/cloud/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const json = (await res.json()) as { code?: number; message?: string; data?: T };
  if (!res.ok || (json.code !== undefined && json.code !== 0)) {
    throw new ApiError(json.code ?? res.status, json.message ?? '请求失败');
  }
  return json.data as T;
}

export async function withDelay<T>(fn: () => T, ms = 280): Promise<T> {
  await new Promise((r) => setTimeout(r, ms));
  return fn();
}

export type { MockHandler };
