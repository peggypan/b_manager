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
import type { CommunityPostAdmin } from '../../api/types';
import {
  auditCommunity,
  deleteCommunityPost,
  fetchCommunity,
  setCommunityInfoHidden,
} from '../../services/adminApi';

export default function CommunityAuditPage() {
  const list = usePagedList(fetchCommunity);
  useListStatusFromSearchParam(list.setStatus);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const detail = useEntityDetailModal('community', () => {
    message.success('帖子信息已更新');
    list.reload();
  });

  const runAudit = async (id: number, status: 'approved' | 'rejected') => {
    setActionLoading(id);
    try {
      await auditCommunity(id, status);
      message.success('审核完成');
      list.reload();
    } catch (e) {
      message.error(e instanceof Error ? e.message : '操作失败');
    } finally {
      setActionLoading(null);
    }
  };

  const runDelete = async (id: number) => {
    setActionLoading(id);
    try {
      await deleteCommunityPost(id);
      message.success('帖子已删除');
      list.reload();
    } catch (e) {
      message.error(e instanceof Error ? e.message : '删帖失败');
    } finally {
      setActionLoading(null);
    }
  };

  const runInfoHidden = async (id: number, hidden: boolean) => {
    setActionLoading(id);
    try {
      await setCommunityInfoHidden(id, hidden);
      message.success(hidden ? '已对 C 端隐藏敏感信息' : '已恢复 C 端信息展示');
      list.reload();
    } catch (e) {
      message.error(e instanceof Error ? e.message : '操作失败');
    } finally {
      setActionLoading(null);
    }
  };

  const columns: ColumnsType<CommunityPostAdmin> = [
    { title: '标题', dataIndex: 'title', width: 220, ellipsis: true },
    { title: '分类', dataIndex: 'category', width: 90 },
    { title: '作者', dataIndex: 'author', width: 100, ellipsis: true },
    ...contactTableColumns<CommunityPostAdmin>(),
    { title: '点赞', dataIndex: 'likes', width: 70 },
    { title: '评论', dataIndex: 'comments', width: 70 },
    { title: '时间', dataIndex: 'time', width: 90 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 96,
      render: (s) => <StatusTag status={s} />,
    },
    {
      title: '信息',
      dataIndex: 'infoHidden',
      width: 88,
      render: (hidden: boolean | undefined) =>
        hidden ? <Tag color="orange">已隐藏</Tag> : <Tag>正常展示</Tag>,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 320,
      render: (_, row) => (
        <Space size={0} wrap split={<span style={{ color: '#e2e8f0' }}>|</span>}>
          <DetailActionLinks id={row.id} onOpen={detail.open} />
          <AuditActions
            status={row.status}
            loading={actionLoading === row.id}
            onApprove={() => runAudit(row.id, 'approved')}
            onReject={() => runAudit(row.id, 'rejected')}
          />
          {row.infoHidden ? (
            <Popconfirm
              title="恢复对小程序展示作者与正文联系方式？"
              onConfirm={() => runInfoHidden(row.id, false)}
            >
              <Button type="link" size="small" loading={actionLoading === row.id}>
                显示信息
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="将对 C 端隐藏作者及正文内联系方式，后台仍可查看完整信息。"
              onConfirm={() => runInfoHidden(row.id, true)}
            >
              <Button type="link" size="small" loading={actionLoading === row.id}>
                隐藏信息
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="删帖后不可恢复，确认删除？"
            okText="删除"
            okButtonProps={{ danger: true }}
            onConfirm={() => runDelete(row.id)}
          >
            <Button type="link" size="small" danger loading={actionLoading === row.id}>
              删帖
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ListPageShell
        title="社区帖子审核"
        description="对应小程序「宠业社区」用户发帖与 UGC 内容。支持审核、隐藏 C 端敏感信息、删帖。"
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
