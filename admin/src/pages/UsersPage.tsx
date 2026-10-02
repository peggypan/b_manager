import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ListPageShell } from '../components/ListPageShell';
import { usePagedList } from '../hooks/usePagedList';
import type { WxUser } from '../api/types';
import { fetchUsers } from '../services/adminApi';
import { formatExpireLabel } from '../utils/memberExpire';

const levelMap: Record<string, string> = {
  free: '免费',
  basic: '基础会员',
  advanced: '高级会员',
  vip: 'VIP',
};

export default function UsersPage() {
  const list = usePagedList(fetchUsers);

  const columns: ColumnsType<WxUser> = [
    { title: '昵称', dataIndex: 'nickname', width: 140 },
    { title: 'OpenID', dataIndex: 'openid', ellipsis: true },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 140,
      render: (phone: string | undefined) => phone || '—',
    },
    {
      title: '会员等级',
      dataIndex: 'memberLevel',
      width: 120,
      render: (l) => <Tag color={l === 'free' ? 'default' : 'blue'}>{levelMap[l] ?? l}</Tag>,
    },
    {
      title: '会员状态',
      width: 100,
      render: (_, r) => (r.memberActive && r.memberLevel !== 'free' ? '有效' : '未开通/已过期'),
    },
    {
      title: '到期日期',
      dataIndex: 'expireDate',
      width: 120,
      render: (v: string | undefined) => formatExpireLabel(v),
    },
    { title: '注册时间', dataIndex: 'createdAt', width: 120 },
  ];

  return (
    <ListPageShell
      title="小程序用户"
      description="后续从云数据库 users / membership 集合同步；会员规则与小程序 utils/member.js 一致。"
      columns={columns}
      loading={list.loading}
      data={list.data}
      keyword={list.keyword}
      onKeywordChange={list.setKeyword}
      showStatusFilter={false}
      onPageChange={list.onPageChange}
      onReload={list.reload}
      rowKey="id"
    />
  );
}
