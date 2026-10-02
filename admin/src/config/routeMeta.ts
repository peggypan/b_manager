/** 路由 → 面包屑 / 页面标题 */
export const routeMeta: Record<string, { title: string; group?: string }> = {
  '/dashboard': { title: '工作台' },
  '/audit/company': { title: '展厅入驻审核', group: '审核中心' },
  '/audit/publish': { title: '会员发布管理', group: '审核中心' },
  '/audit/community': { title: '社区帖子审核', group: '审核中心' },
  '/content/factories': { title: '找工厂', group: '内容管理' },
  '/content/orders': { title: '找订单', group: '内容管理' },
  '/content/store-supply': { title: '门店货源', group: '内容管理' },
  '/content/store-demands': { title: '门店求购', group: '内容管理' },
  '/content/invest': { title: '创投项目', group: '内容管理' },
  '/content/influencers': { title: '达人资源', group: '内容管理' },
  '/content/directory': { title: '宠业展厅', group: '内容管理' },
  '/content/industry': { title: '产业园 / 商协会', group: '内容管理' },
  '/content/banners': { title: '首页轮播', group: '内容管理' },
  '/content/media': { title: '新媒体服务', group: '内容管理' },
  '/users': { title: '小程序用户', group: '用户与会员' },
  '/members/paid': { title: '付费会员', group: '用户与会员' },
  '/members/plans': { title: '付费套餐配置', group: '用户与会员' },
  '/members/orders': { title: '付费订单', group: '用户与会员' },
  '/finance/receipts': { title: '收款管理', group: '财务中心' },
};

export function breadcrumbItems(pathname: string) {
  const meta = routeMeta[pathname];
  if (!meta) return [{ title: '工作台' }];
  const items: { title: string }[] = [];
  if (meta.group) items.push({ title: meta.group });
  items.push({ title: meta.title });
  return items;
}
