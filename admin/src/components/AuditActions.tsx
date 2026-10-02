import { Button, Popconfirm, Space } from 'antd';
import type { AuditStatus } from '../api/types';

type Props = {
  status: AuditStatus;
  loading?: boolean;
  onApprove: () => void;
  onReject: () => void;
};

export function AuditActions({ status, loading, onApprove, onReject }: Props) {
  if (status !== 'pending') {
    return <span style={{ color: '#94a3b8' }}>—</span>;
  }
  return (
    <Space size="small">
      <Popconfirm title="确认通过？" onConfirm={onApprove}>
        <Button type="link" size="small" loading={loading}>
          通过
        </Button>
      </Popconfirm>
      <Popconfirm title="确认驳回？" onConfirm={onReject}>
        <Button type="link" size="small" danger loading={loading}>
          驳回
        </Button>
      </Popconfirm>
    </Space>
  );
}
