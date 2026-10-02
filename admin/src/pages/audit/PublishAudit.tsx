import { Button, message, Popconfirm, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { AuditActions } from '../../components/AuditActions';
import { DetailActionLinks } from '../../components/DetailActionLinks';
import { ListPageShell } from '../../components/ListPageShell';
import { StatusTag } from '../../components/StatusTag';
import { useEntityDetailModal } from '../../hooks/useEntityDetailModal';
import { useListStatusFromSearchParam } from '../../hooks/useListStatusFromSearchParam';
import { usePagedList } from '../../hooks/usePagedList';
import { contactTableColumns } from '../../config/contactFields';
import type { PublishItem } from '../../api/types';
import { auditPublish, deleteAdminRecord, fetchPublishItems } from '../../services/adminApi';

const typeLabel: Record<string, string> = {
  factory_info: '工厂信息',
  factory: '工厂需求',
  order: '找订单·产品',
  order_demand: '找订单·需求',
  invest: '创投项目',
  storeSupply: '门店货源',
  storeDemand: '门店求购',
  directory: '展厅入驻',
  industry: '产业园/商协会',
  community: '社区笔记',
  influencer: '达人入驻',
};

export default function PublishAuditPage() {
  const list = usePagedList(fetchPublishItems);
  useListStatusFromSearchParam(list.setStatus);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const detail = useEntityDetailModal('publish', () => {
    message.success('发布信息已更新');
    list.reload();
  });

  const runDelete = async (id: number) => {
    setActionLoading(id);
    try {
      await deleteAdminRecord('publish', id);
      message.success('已删除');
      list.reload();
    } catch (e) {
      message.error(e instanceof Error ? e.message : '删除失败');
    } finally {
      setActionLoading(null);
    }
  };

  const runAudit = async (id: number, status: 'approved' | 'rejected') => {
    setActionLoading(id);
    try {
      await auditPublish(id, status);
      message.success('审核完成');
      list.reload();
    } catch (e) {
      message.error(e instanceof Error ? e.message : '操作失败');
    } finally {
      setActionLoading(null);
    }
  };

  const columns: ColumnsType<PublishItem> = [
    { title: '标题', dataIndex: 'title', width: 220 },
    {
      title: '类型',
      dataIndex: 'type',
      width: 110,
      render: (t) => <Tag>{typeLabel[t] ?? t}</Tag>,
    },
    { title: '发布方', dataIndex: 'publisher', width: 120 },
    ...contactTableColumns<PublishItem>(),
    { title: '摘要', dataIndex: 'summary', ellipsis: true, width: 140 },
    { title: '时间', dataIndex: 'createdAt', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (s) => <StatusTag status={s} />,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 280,
      render: (_, row) => (
        <Space size={4} wrap>
          <DetailActionLinks id={row.id} onOpen={detail.open} />
          <AuditActions
            status={row.status}
            loading={actionLoading === row.id}
            onApprove={() => runAudit(row.id, 'approved')}
            onReject={() => runAudit(row.id, 'rejected')}
          />
          <Popconfirm
            title="删除后不可恢复，确认删除？"
            okText="删除"
            okButtonProps={{ danger: true }}
            onConfirm={() => runDelete(row.id)}
          >
            <Button type="link" size="small" danger loading={actionLoading === row.id}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ListPageShell
        title="会员发布管理"
        description="对应小程序 Tab「发布 / 我的发布」及会员发布能力：工厂信息、工厂需求、找订单产品/需求、门店货源/求购、创投、展厅入驻、产业园/商协会、社区笔记等。C 端多数为免审直发（published）；后台可编辑、下架（offline）。审核通过 factory_info / directory / industry 会同步至对应内容库。"
        columns={columns}
        loading={list.loading}
        data={list.data}
        keyword={list.keyword}
        onKeywordChange={list.setKeyword}
        status={list.status ?? ''}
        onStatusChange={(v) => list.setStatus(v as typeof list.status)}
        onPageChange={list.onPageChange}
        onReload={list.reload}
        rowKey="id"
      />
      {detail.modal}
    </>
  );
}
