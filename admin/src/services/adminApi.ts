import { callCloud, CloudFunctions } from '../api/client';
import type {
  AdminResource,
  AdminUser,
  AuditStatus,
  DashboardStats,
  PageQuery,
  PageResult,
  BannerItem,
  CommunityPostAdmin,
  CompanyApply,
  DirectoryCompanyItem,
  FactoryItem,
  IndustryOrgItem,
  InfluencerItem,
  InvestProjectItem,
  MediaServiceItem,
  OrderSchemeItem,
  PublishItem,
  StoreDemandItem,
  StoreSupplyItem,
  MemberOrder,
  MemberPlanConfig,
  PaymentReceipt,
  ReceiptBizType,
  WxUser,
} from '../api/types';

export async function login(username: string, password: string) {
  return callCloud<{ token: string; user: AdminUser }>(CloudFunctions.login, {
    username,
    password,
  });
}

export async function fetchDashboard() {
  return callCloud<DashboardStats>(CloudFunctions.dashboard);
}

export async function fetchCompanyApplies(query: PageQuery) {
  return callCloud<PageResult<CompanyApply>>(CloudFunctions.listCompanyApply, query);
}

export async function getCompanyApply(id: number) {
  return callCloud<CompanyApply>(CloudFunctions.getCompanyApply, { id });
}

export async function updateCompanyApply(
  id: number,
  data: Partial<
    Pick<
      CompanyApply,
      | 'name'
      | 'type'
      | 'category'
      | 'region'
      | 'contact'
      | 'phone'
      | 'wechat'
      | 'intro'
      | 'products'
      | 'auditNote'
      | 'images'
    >
  >,
) {
  return callCloud<{ ok: boolean }>(CloudFunctions.updateCompanyApply, { id, ...data });
}

export async function auditCompany(id: number, status: AuditStatus, auditNote?: string) {
  return callCloud<{ ok: boolean }>(CloudFunctions.auditCompany, { id, status, auditNote });
}

export async function fetchPublishItems(query: PageQuery) {
  return callCloud<PageResult<PublishItem>>(CloudFunctions.listPublish, query);
}

export async function auditPublish(id: number, status: AuditStatus) {
  return callCloud<{ ok: boolean }>(CloudFunctions.auditPublish, { id, status });
}

export async function getAdminRecord<T extends object>(resource: AdminResource, id: number) {
  return callCloud<T>(CloudFunctions.getAdminRecord, { resource, id });
}

export async function updateAdminRecord(
  resource: AdminResource,
  id: number,
  data: Record<string, unknown>,
) {
  return callCloud<{ ok: boolean }>(CloudFunctions.updateAdminRecord, { resource, id, ...data });
}

export async function deleteAdminRecord(resource: AdminResource, id: number) {
  return callCloud<{ ok: boolean }>(CloudFunctions.deleteAdminRecord, { resource, id });
}

export async function createAdminRecord(
  resource: AdminResource,
  data: Record<string, unknown>,
) {
  return callCloud<{ ok: boolean; id: number }>(CloudFunctions.createAdminRecord, {
    resource,
    ...data,
  });
}

export async function fetchUsers(query: PageQuery) {
  return callCloud<PageResult<WxUser>>(CloudFunctions.listUsers, query);
}

export async function fetchPaidMembers(query: PageQuery) {
  return callCloud<PageResult<WxUser>>(CloudFunctions.listPaidMembers, query);
}

export async function updateUserMembership(payload: {
  userId: string;
  level: WxUser['memberLevel'];
  active: boolean;
  expireDate?: string;
}) {
  return callCloud<{ ok: boolean }>(CloudFunctions.updateUserMembership, payload);
}

export async function fetchMemberPlans() {
  return callCloud<PageResult<MemberPlanConfig>>(CloudFunctions.listMemberPlans, {});
}

export async function updateMemberPlan(payload: {
  level: MemberPlanConfig['level'];
  price?: number;
  enabled?: boolean;
  publishLimit?: number;
  name?: string;
}) {
  return callCloud<{ ok: boolean }>(CloudFunctions.updateMemberPlan, payload);
}

export async function fetchMemberOrders(query: PageQuery) {
  return callCloud<PageResult<MemberOrder>>(CloudFunctions.listMemberOrders, query);
}

export async function confirmMemberOrder(id: string) {
  return callCloud<{ ok: boolean }>(CloudFunctions.confirmMemberOrder, { id });
}

export async function fetchPaymentReceipts(query: PageQuery) {
  return callCloud<PageResult<PaymentReceipt>>(CloudFunctions.listPaymentReceipts, query);
}

export async function getPaymentReceipt(id: string) {
  return callCloud<PaymentReceipt>(CloudFunctions.getPaymentReceipt, { id });
}

export async function createPaymentReceipt(payload: {
  bizType: ReceiptBizType;
  bizTitle: string;
  payerName: string;
  amount: number;
  payChannel: PaymentReceipt['payChannel'];
  remark?: string;
}) {
  return callCloud<{ id: string; receiptNo: string }>(CloudFunctions.createPaymentReceipt, payload);
}

export async function confirmPaymentReceipt(id: string, remark?: string) {
  return callCloud<{ ok: boolean }>(CloudFunctions.confirmPaymentReceipt, { id, remark });
}

export async function refundPaymentReceipt(id: string, remark?: string) {
  return callCloud<{ ok: boolean }>(CloudFunctions.refundPaymentReceipt, { id, remark });
}

export async function fetchFactories(query: PageQuery) {
  return callCloud<PageResult<FactoryItem>>(CloudFunctions.listFactories, query);
}

export async function fetchOrders(query: PageQuery) {
  return callCloud<PageResult<OrderSchemeItem>>(CloudFunctions.listOrders, query);
}

export async function fetchStoreSupply(query: PageQuery) {
  return callCloud<PageResult<StoreSupplyItem>>(CloudFunctions.listStoreSupply, query);
}

export async function fetchStoreDemands(query: PageQuery) {
  return callCloud<PageResult<StoreDemandItem>>(CloudFunctions.listStoreDemands, query);
}

export async function fetchProjects(query: PageQuery) {
  return callCloud<PageResult<InvestProjectItem>>(CloudFunctions.listProjects, query);
}

export async function fetchInfluencers(query: PageQuery) {
  return callCloud<PageResult<InfluencerItem>>(CloudFunctions.listInfluencers, query);
}

export async function fetchDirectory(query: PageQuery) {
  return callCloud<PageResult<DirectoryCompanyItem>>(CloudFunctions.listDirectory, query);
}

export async function fetchIndustryOrgs(query: PageQuery) {
  return callCloud<PageResult<IndustryOrgItem>>(CloudFunctions.listIndustryOrgs, query);
}

export async function fetchCommunity(query: PageQuery) {
  return callCloud<PageResult<CommunityPostAdmin>>(CloudFunctions.listCommunity, query);
}

export async function auditCommunity(id: number, status: AuditStatus) {
  return callCloud<{ ok: boolean }>(CloudFunctions.auditCommunity, { id, status });
}

export async function deleteCommunityPost(id: number) {
  return callCloud<{ ok: boolean }>(CloudFunctions.deleteCommunity, { id });
}

export async function setCommunityInfoHidden(id: number, hidden: boolean) {
  return callCloud<{ ok: boolean }>(CloudFunctions.setCommunityInfoHidden, { id, hidden });
}

export async function fetchBanners(query: PageQuery) {
  return callCloud<PageResult<BannerItem>>(CloudFunctions.listBanners, query);
}

export async function fetchMediaServices(query: PageQuery) {
  return callCloud<PageResult<MediaServiceItem>>(CloudFunctions.listMediaServices, query);
}
