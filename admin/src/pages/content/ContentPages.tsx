import { message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';
import { contactTableColumns } from '../../config/contactFields';
import { ContentRecordActions } from '../../components/ContentRecordActions';
import { ListPageShell } from '../../components/ListPageShell';
import { StatusTag } from '../../components/StatusTag';
import { useEntityDetailModal } from '../../hooks/useEntityDetailModal';
import { usePagedList } from '../../hooks/usePagedList';
import type {
  AdminResource,
  BannerItem,
  DirectoryCompanyItem,
  FactoryItem,
  IndustryOrgItem,
  InfluencerItem,
  InvestProjectItem,
  MediaServiceItem,
  OrderSchemeItem,
  PageResult,
  StoreDemandItem,
  StoreSupplyItem,
} from '../../api/types';
import {
  fetchBanners,
  fetchDirectory,
  fetchFactories,
  fetchIndustryOrgs,
  fetchInfluencers,
  fetchMediaServices,
  fetchOrders,
  fetchProjects,
  fetchStoreDemands,
  fetchStoreSupply,
  deleteAdminRecord,
} from '../../services/adminApi';

function useContentDelete(resource: AdminResource, reload: () => void) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const runDelete = useCallback(
    async (id: number) => {
      setLoadingId(id);
      try {
        await deleteAdminRecord(resource, id);
        message.success('已删除');
        reload();
      } catch (e) {
        message.error(e instanceof Error ? e.message : '删除失败');
      } finally {
        setLoadingId(null);
      }
    },
    [resource, reload],
  );
  return { runDelete, loadingId };
}

function contentActionColumn<T extends { id: number }>(
  open: (id: number, mode: 'view' | 'edit') => void,
  runDelete: (id: number) => void,
  loadingId: number | null,
): ColumnsType<T>[number] {
  return {
    title: '操作',
    fixed: 'right',
    width: 168,
    render: (_, row) => (
      <ContentRecordActions
        id={row.id}
        onOpen={open}
        onDelete={runDelete}
        loading={loadingId === row.id}
      />
    ),
  };
}

function useContentDetail(resource: AdminResource, reload: () => void) {
  return useEntityDetailModal(resource, () => {
    message.success('操作成功');
    reload();
  });
}

export function FactoriesPage() {
  const list = usePagedList(fetchFactories);
  const detail = useContentDetail('factories', list.reload);
  const { runDelete, loadingId } = useContentDelete('factories', list.reload);
  const columns: ColumnsType<FactoryItem> = [
    { title: '工厂名称', dataIndex: 'name', width: 160 },
    { title: '品类', dataIndex: 'category', width: 80 },
    { title: '地区', dataIndex: 'region', width: 110 },
    {
      title: '能力标签',
      dataIndex: 'tags',
      width: 140,
      render: (t: string[]) => (t?.length ? t.join('、') : '—'),
    },
    {
      title: '业务',
      dataIndex: 'bizTypes',
      width: 160,
      render: (t: string[]) => t?.join('、'),
    },
    { title: '起订量', dataIndex: 'moq', width: 90 },
    { title: '简介', dataIndex: 'intro', ellipsis: true, width: 180 },
    { title: '发布方', dataIndex: 'publisher', width: 110 },
    ...contactTableColumns<FactoryItem>(),
    { title: '状态', dataIndex: 'status', width: 100, render: (s) => <StatusTag status={s} /> },
    contentActionColumn(detail.open, runDelete, loadingId),
  ];
  return (
    <>
      <ListPageShell
        title="找工厂"
        description="小程序「找工厂」列表 + 会员「发布工厂信息」（localPublishedFactories），含能力标签、简介与联系方式。"
        columns={columns}
        {...listShellProps(list, detail.openCreate)}
        rowKey="id"
      />
      {detail.modal}
    </>
  );
}

export function OrdersPage() {
  const list = usePagedList(fetchOrders);
  const detail = useContentDetail('orders', list.reload);
  const { runDelete, loadingId } = useContentDelete('orders', list.reload);
  const columns: ColumnsType<OrderSchemeItem> = [
    { title: '标题', dataIndex: 'title' },
    { title: '工厂', dataIndex: 'factoryName' },
    { title: '类型', dataIndex: 'type', width: 100 },
    { title: '品类', dataIndex: 'category', width: 90 },
    { title: '起订', dataIndex: 'moq', width: 90 },
    { title: '价格', dataIndex: 'price', width: 100 },
    ...contactTableColumns<OrderSchemeItem>(),
    { title: '状态', dataIndex: 'status', width: 100, render: (s) => <StatusTag status={s} /> },
    contentActionColumn(detail.open, runDelete, loadingId),
  ];
  return (
    <>
      <ListPageShell
        title="找订单"
        description="小程序「找订单 / 代工方案 / 现货产品」。"
        columns={columns}
        {...listShellProps(list, detail.openCreate)}
        rowKey="id"
      />
      {detail.modal}
    </>
  );
}

export function StoreSupplyPage() {
  const list = usePagedList(fetchStoreSupply);
  const detail = useContentDetail('storeSupply', list.reload);
  const { runDelete, loadingId } = useContentDelete('storeSupply', list.reload);
  const columns: ColumnsType<StoreSupplyItem> = [
    { title: '商品', dataIndex: 'name' },
    { title: '工厂', dataIndex: 'factoryName' },
    { title: '品类', dataIndex: 'category', width: 90 },
    { title: '产地', dataIndex: 'origin', width: 90 },
    { title: '代发价', dataIndex: 'price', width: 90, render: (p) => `¥${p}` },
    {
      title: '一件代发',
      dataIndex: 'dropship',
      width: 100,
      render: (v) => (v ? '是' : '否'),
    },
    ...contactTableColumns<StoreSupplyItem>(),
    { title: '状态', dataIndex: 'status', width: 100, render: (s) => <StatusTag status={s} /> },
    contentActionColumn(detail.open, runDelete, loadingId),
  ];
  return (
    <>
      <ListPageShell
        title="门店货源"
        description="小程序「门店货源 / 一件代发」。"
        columns={columns}
        {...listShellProps(list, detail.openCreate)}
        rowKey="id"
      />
      {detail.modal}
    </>
  );
}

export function StoreDemandsPage() {
  const list = usePagedList(fetchStoreDemands);
  const detail = useContentDetail('storeDemands', list.reload);
  const { runDelete, loadingId } = useContentDelete('storeDemands', list.reload);
  const columns: ColumnsType<StoreDemandItem> = [
    { title: '求购标题', dataIndex: 'title' },
    { title: '门店', dataIndex: 'storeName' },
    { title: '品类', dataIndex: 'category', width: 90 },
    { title: '地区', dataIndex: 'region', width: 120 },
    { title: '时间', dataIndex: 'time', width: 120 },
    ...contactTableColumns<StoreDemandItem>(),
    { title: '状态', dataIndex: 'status', width: 100, render: (s) => <StatusTag status={s} /> },
    contentActionColumn(detail.open, runDelete, loadingId),
  ];
  return (
    <>
      <ListPageShell
        title="门店求购"
        description="小程序「门店求购」与供需市场门店需求。"
        columns={columns}
        {...listShellProps(list, detail.openCreate)}
        rowKey="id"
      />
      {detail.modal}
    </>
  );
}

export function InvestPage() {
  const list = usePagedList(fetchProjects);
  const detail = useContentDetail('projects', list.reload);
  const { runDelete, loadingId } = useContentDelete('projects', list.reload);
  const columns: ColumnsType<InvestProjectItem> = [
    { title: '项目名称', dataIndex: 'name' },
    { title: '赛道', dataIndex: 'track', width: 100 },
    { title: '阶段', dataIndex: 'stage', width: 90 },
    { title: '需求', dataIndex: 'need', ellipsis: true },
    ...contactTableColumns<InvestProjectItem>(),
    { title: '状态', dataIndex: 'status', width: 100, render: (s) => <StatusTag status={s} /> },
    contentActionColumn(detail.open, runDelete, loadingId),
  ];
  return (
    <>
      <ListPageShell
        title="创投项目"
        description="小程序「宠业创投」项目路演列表。"
        columns={columns}
        {...listShellProps(list, detail.openCreate)}
        rowKey="id"
      />
      {detail.modal}
    </>
  );
}

export function InfluencersPage() {
  const list = usePagedList(fetchInfluencers);
  const detail = useContentDetail('influencers', list.reload);
  const { runDelete, loadingId } = useContentDelete('influencers', list.reload);
  const columns: ColumnsType<InfluencerItem> = [
    { title: '达人', dataIndex: 'name' },
    { title: '平台', dataIndex: 'platform', width: 100 },
    { title: '粉丝', dataIndex: 'fans', width: 90 },
    { title: '垂类', dataIndex: 'category', width: 100 },
    { title: '合作模式', dataIndex: 'mode', width: 120 },
    ...contactTableColumns<InfluencerItem>(),
    { title: '状态', dataIndex: 'status', width: 100, render: (s) => <StatusTag status={s} /> },
    contentActionColumn(detail.open, runDelete, loadingId),
  ];
  return (
    <>
      <ListPageShell
        title="达人资源"
        description="小程序创投模块中的达人合作资源。"
        columns={columns}
        {...listShellProps(list, detail.openCreate)}
        rowKey="id"
      />
      {detail.modal}
    </>
  );
}

export function DirectoryPage() {
  const list = usePagedList(fetchDirectory);
  const detail = useContentDetail('directory', list.reload);
  const { runDelete, loadingId } = useContentDelete('directory', list.reload);
  const columns: ColumnsType<DirectoryCompanyItem> = [
    { title: '名称', dataIndex: 'name' },
    { title: '类型', dataIndex: 'type', width: 90 },
    { title: '品类', dataIndex: 'category', width: 120 },
    { title: '地区', dataIndex: 'region', width: 120 },
    ...contactTableColumns<DirectoryCompanyItem>(),
    { title: '状态', dataIndex: 'status', width: 100, render: (s) => <StatusTag status={s} /> },
    contentActionColumn(detail.open, runDelete, loadingId),
  ];
  return (
    <>
      <ListPageShell
        title="宠业展厅"
        description="小程序展厅五模块中的工厂 / 品牌 / 商家（localPublishedDirectory）；产业园、商协会见「产业园/商协会」。免费入驻须填联系人、电话、微信号。"
        columns={columns}
        {...listShellProps(list, detail.openCreate)}
        rowKey="id"
      />
      {detail.modal}
    </>
  );
}

export function IndustryPage() {
  const list = usePagedList(fetchIndustryOrgs);
  const detail = useContentDetail('industryOrgs', list.reload);
  const { runDelete, loadingId } = useContentDelete('industryOrgs', list.reload);
  const columns: ColumnsType<IndustryOrgItem> = [
    { title: '名称', dataIndex: 'name' },
    { title: '类型', dataIndex: 'type', width: 100 },
    { title: '地区', dataIndex: 'region', width: 120 },
    { title: '规模', dataIndex: 'scale', ellipsis: true },
    ...contactTableColumns<IndustryOrgItem>(),
    { title: '状态', dataIndex: 'status', width: 100, render: (s) => <StatusTag status={s} /> },
    contentActionColumn(detail.open, runDelete, loadingId),
  ];
  return (
    <>
      <ListPageShell
        title="产业园 / 商协会"
        description="小程序「宠业展厅 → 免费入驻」中的产业园、商协会（localPublishedIndustryParks / Associations）。"
        columns={columns}
        {...listShellProps(list, detail.openCreate)}
        rowKey="id"
      />
      {detail.modal}
    </>
  );
}

export function BannersPage() {
  const list = usePagedList(fetchBanners);
  const detail = useContentDetail('banners', list.reload);
  const { runDelete, loadingId } = useContentDelete('banners', list.reload);
  const columns: ColumnsType<BannerItem> = [
    { title: '排序', dataIndex: 'sort', width: 70 },
    { title: '标题', dataIndex: 'title' },
    {
      title: '图片',
      dataIndex: 'image',
      width: 120,
      render: (url) => (
        <img src={url} alt="" style={{ width: 96, height: 40, objectFit: 'cover', borderRadius: 4 }} />
      ),
    },
    {
      title: '启用',
      dataIndex: 'enabled',
      width: 90,
      render: (v) => (v ? '是' : '否'),
    },
    contentActionColumn(detail.open, runDelete, loadingId),
  ];
  return (
    <>
      <ListPageShell
        title="首页轮播"
        description="小程序首页 Banner，后续对接云存储图片 ID。"
        columns={columns}
        {...listShellProps(list, detail.openCreate, '新增轮播')}
        showStatusFilter={false}
        rowKey="id"
      />
      {detail.modal}
    </>
  );
}

export function MediaServicesPage() {
  const list = usePagedList(fetchMediaServices);
  const detail = useContentDetail('mediaServices', list.reload);
  const { runDelete, loadingId } = useContentDelete('mediaServices', list.reload);
  const columns: ColumnsType<MediaServiceItem> = [
    { title: '服务名称', dataIndex: 'name' },
    {
      title: '封面',
      dataIndex: 'image',
      width: 100,
      render: (url: string | undefined) =>
        url ? (
          <img src={url} alt="" style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          '—'
        ),
    },
    { title: '价格', dataIndex: 'price', width: 100 },
    { title: '说明', dataIndex: 'desc', ellipsis: true },
    ...contactTableColumns<MediaServiceItem>(),
    {
      title: '上架',
      dataIndex: 'enabled',
      width: 90,
      render: (v) => (v ? '是' : '否'),
    },
    contentActionColumn(detail.open, runDelete, loadingId),
  ];
  return (
    <>
      <ListPageShell
        title="新媒体服务"
        description="小程序「宠业创投 / 推广服务」卡片封面与预约套餐；修改时可上传封面或粘贴图片链接。"
        columns={columns}
        {...listShellProps(list, detail.openCreate, '新增服务')}
        showStatusFilter={false}
        rowKey="id"
      />
      {detail.modal}
    </>
  );
}

function listShellProps<T extends object>(
  list: {
    loading: boolean;
    data: PageResult<T>;
    keyword: string;
    setKeyword: (v: string) => void;
    status?: string;
    setStatus: (v: string) => void;
    onPageChange: (page: number, pageSize: number) => void;
    reload: () => void;
  },
  onCreate?: () => void,
  createLabel = '新增',
) {
  return {
    loading: list.loading,
    data: list.data,
    keyword: list.keyword,
    onKeywordChange: list.setKeyword,
    status: list.status ?? '',
    onStatusChange: (v: string) => list.setStatus(v),
    onPageChange: list.onPageChange,
    onReload: list.reload,
    onCreate,
    createLabel,
  };
}
