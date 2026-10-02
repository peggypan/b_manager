import { message, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { AuditActions } from '../../components/AuditActions';
import { CompanyApplyDetailModal } from '../../components/CompanyApplyDetailModal';
import { ListPageShell } from '../../components/ListPageShell';
import { StatusTag } from '../../components/StatusTag';
import { useListStatusFromSearchParam } from '../../hooks/useListStatusFromSearchParam';
import { usePagedList } from '../../hooks/usePagedList';
import { contactTableColumns } from '../../config/contactFields';
import type { CompanyApply } from '../../api/types';
import { auditCompany, fetchCompanyApplies } from '../../services/adminApi';

export default function CompanyAuditPage() {
  const list = usePagedList(fetchCompanyApplies);
  useListStatusFromSearchParam(list.setStatus);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [modalApplyId, setModalApplyId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  const openDetail = (id: number, mode: 'view' | 'edit') => {
    setModalApplyId(id);
    setModalMode(mode);
  };

  const runAudit = async (id: number, status: 'approved' | 'rejected') => {
    setActionLoading(id);
    try {
      await auditCompany(id, status);
      message.success(status === 'approved' ? '已通过，将同步至展厅黄页' : '已驳回');
      list.reload();
    } catch (e) {
      message.error(e instanceof Error ? e.message : '操作失败');
    } finally {
      setActionLoading(null);
    }
  };

  const columns: ColumnsType<CompanyApply> = [
    { title: '企业名称', dataIndex: 'name', width: 180 },
    { title: '类型', dataIndex: 'type', width: 90 },
    { title: '品类', dataIndex: 'category', width: 100 },
    { title: '地区', dataIndex: 'region', width: 120 },
    ...contactTableColumns<CompanyApply>(),
    { title: '申请时间', dataIndex: 'applyTime', width: 160 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (s) => <StatusTag status={s} />,
    },
    { title: '备注', dataIndex: 'auditNote', ellipsis: true },
    {
      title: '操作',
      fixed: 'right',
      width: 220,
      render: (_, row) => (
        <Space size={4} wrap>
          <a onClick={() => openDetail(row.id, 'view')}>查看</a>
          <a onClick={() => openDetail(row.id, 'edit')}>修改</a>
          <AuditActions
            status={row.status}
            loading={actionLoading === row.id}
            onApprove={() => runAudit(row.id, 'approved')}
            onReject={() => runAudit(row.id, 'rejected')}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <ListPageShell
        title="展厅入驻审核"
        description="对应小程序「宠业展厅 → 免费入驻」中的工厂 / 品牌 / 商家（与产业园、商协会表单分开）。C 端当前提交后即时展示（status=published）；接入云后可在此审核，通过后同步至「内容管理 · 宠业展厅」。联系人、联系电话、微信号均为必填。"
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
      <CompanyApplyDetailModal
        applyId={modalApplyId}
        mode={modalMode}
        open={modalApplyId !== null}
        onClose={() => setModalApplyId(null)}
        onSaved={() => {
          message.success('入驻信息已更新');
          list.reload();
        }}
      />
    </>
  );
}
