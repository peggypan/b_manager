import { Tag } from 'antd';
import type { AuditStatus } from '../api/types';

const map: Record<AuditStatus, { color: string; label: string }> = {
  pending: { color: 'gold', label: '待审核' },
  approved: { color: 'green', label: '已通过' },
  published: { color: 'green', label: '已发布' },
  rejected: { color: 'red', label: '已驳回' },
  offline: { color: 'default', label: '已下架' },
};

export function StatusTag({ status }: { status: AuditStatus }) {
  const cfg = map[status] ?? map.pending;
  return <Tag color={cfg.color}>{cfg.label}</Tag>;
}
