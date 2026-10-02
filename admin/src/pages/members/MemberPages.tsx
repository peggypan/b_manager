import { EditOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Select,
  Switch,
  Table,
  Tag,
  message,
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import {
  formatExpireLabel,
  normalizeExpireDate,
  toExpireDateStorage,
} from '../../utils/memberExpire';

dayjs.locale('zh-cn');
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import { ListPageShell } from '../../components/ListPageShell';
import { PageHeader } from '../../components/PageHeader';
import { memberLevelLabels } from '../../config/memberPlans';
import { usePagedList } from '../../hooks/usePagedList';
import type { MemberLevel, MemberOrder, MemberPlanConfig, WxUser } from '../../api/types';
import {
  confirmMemberOrder,
  fetchMemberOrders,
  fetchMemberPlans,
  fetchPaidMembers,
  updateMemberPlan,
  updateUserMembership,
} from '../../services/adminApi';

const orderStatusOptions = [
  { value: '', label: '全部状态' },
  { value: 'paid', label: '已支付' },
  { value: 'pending', label: '待支付' },
  { value: 'refunded', label: '已退款' },
  { value: 'closed', label: '已关闭' },
];

const levelFilterOptions = [
  { value: '', label: '全部等级' },
  { value: 'basic', label: '基础会员' },
  { value: 'advanced', label: '高级会员' },
  { value: 'vip', label: 'VIP会员' },
];

const payChannelMap: Record<string, string> = {
  wechat: '微信支付',
  manual: '后台开通',
  transfer: '对公转账',
};

function levelTag(level: MemberLevel) {
  const color =
    level === 'vip' ? 'gold' : level === 'advanced' ? 'blue' : level === 'basic' ? 'cyan' : 'default';
  return <Tag color={color}>{memberLevelLabels[level]}</Tag>;
}

export function PaidMembersPage() {
  const [levelFilter, setLevelFilter] = useState<MemberLevel | ''>('');
  const fetcher = useCallback(
    (q: Parameters<typeof fetchPaidMembers>[0]) =>
      fetchPaidMembers({ ...q, memberLevel: levelFilter }),
    [levelFilter],
  );
  const list = usePagedList(fetcher, [levelFilter]);
  const [editUser, setEditUser] = useState<WxUser | null>(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const openEdit = (user: WxUser) => {
    setEditUser(user);
    form.setFieldsValue({
      level: user.memberLevel === 'free' ? 'basic' : user.memberLevel,
      active: user.memberActive,
      expireDate: user.expireDate
        ? dayjs(normalizeExpireDate(user.expireDate), 'YYYY-MM-DD')
        : undefined,
    });
  };

  const saveMembership = async () => {
    if (!editUser) return;
    const values = await form.validateFields();
    setSaving(true);
    try {
      await updateUserMembership({
        userId: editUser.id,
        level: values.level,
        active: values.active,
        expireDate: toExpireDateStorage(values.expireDate),
      });
      message.success('会员信息已更新');
      setEditUser(null);
      list.reload();
    } catch (e) {
      message.error(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

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
      render: (l: MemberLevel) => levelTag(l),
    },
    {
      title: '状态',
      width: 100,
      render: (_, r) =>
        r.memberActive && r.memberLevel !== 'free' ? (
          <Tag color="success">有效</Tag>
        ) : (
          <Tag>已过期/未开通</Tag>
        ),
    },
    {
      title: '到期日期',
      dataIndex: 'expireDate',
      width: 120,
      render: (v: string | undefined) => formatExpireLabel(v),
    },
    { title: '注册时间', dataIndex: 'createdAt', width: 120 },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (_, row) => (
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(row)}>
          调整会员
        </Button>
      ),
    },
  ];

  return (
    <>
      <ListPageShell
        title="付费会员"
        description="管理已开通或曾开通付费套餐的小程序用户，可手动续期、升降级（Mock 数据，接入微信支付回调后自动同步）。"
        columns={columns}
        loading={list.loading}
        data={list.data}
        keyword={list.keyword}
        onKeywordChange={list.setKeyword}
        showStatusFilter={false}
        onPageChange={list.onPageChange}
        onReload={list.reload}
        toolbarExtra={
          <Select
            style={{ width: 140 }}
            value={levelFilter}
            options={levelFilterOptions}
            onChange={(v) => setLevelFilter(v as MemberLevel | '')}
          />
        }
        rowKey="id"
      />
      <Modal
        title={`调整会员 · ${editUser?.nickname ?? ''}`}
        open={!!editUser}
        onCancel={() => setEditUser(null)}
        onOk={saveMembership}
        confirmLoading={saving}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="level" label="会员等级" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'basic', label: '基础会员' },
                { value: 'advanced', label: '高级会员' },
                { value: 'vip', label: 'VIP会员' },
              ]}
            />
          </Form.Item>
          <Form.Item name="active" label="是否有效" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="expireDate"
            label="到期日期"
            rules={[{ required: true, message: '请选择到期日期' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              placeholder="选择到期日期"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export function MemberPlansPage() {
  const [plans, setPlans] = useState<MemberPlanConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPlan, setEditPlan] = useState<MemberPlanConfig | null>(null);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    fetchMemberPlans()
      .then((res) => setPlans(res.list))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (plan: MemberPlanConfig) => {
    setEditPlan(plan);
    form.setFieldsValue({
      price: plan.price,
      enabled: plan.enabled,
      publishLimit: plan.publishLimit,
    });
  };

  const savePlan = async () => {
    if (!editPlan) return;
    const values = await form.validateFields();
    await updateMemberPlan({
      level: editPlan.level,
      price: values.price,
      enabled: values.enabled,
      publishLimit: values.publishLimit,
    });
    message.success('套餐已保存，小程序端接入配置中心后生效');
    setEditPlan(null);
    load();
  };

  const columns: ColumnsType<MemberPlanConfig> = [
    {
      title: '等级',
      dataIndex: 'level',
      width: 100,
      render: (l) => levelTag(l),
    },
    { title: '名称', dataIndex: 'name', width: 120 },
    {
      title: '价格',
      width: 120,
      render: (_, r) => (
        <span>
          ¥{r.price}/{r.unit}
        </span>
      ),
    },
    {
      title: '发布上限',
      dataIndex: 'publishLimit',
      width: 100,
      render: (n) => (n < 0 ? '不限' : `${n} 条`),
    },
    { title: '适用对象', dataIndex: 'target', ellipsis: true },
    {
      title: '上架',
      dataIndex: 'enabled',
      width: 80,
      render: (v) => (v ? <Tag color="success">上架</Tag> : <Tag>下架</Tag>),
    },
    {
      title: '操作',
      width: 100,
      render: (_, row) => (
        <Button type="link" size="small" onClick={() => openEdit(row)}>
          编辑
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="付费套餐配置"
        description="与小程序 pages/member 套餐一致；价格与发布条数调整后，需同步云数据库 membership_plans 集合。"
        extra={
          <Button onClick={load} loading={loading}>
            刷新
          </Button>
        }
      />
      <Table
        rowKey="level"
        loading={loading}
        columns={columns}
        dataSource={plans}
        pagination={false}
        expandable={{
          expandedRowRender: (r) => (
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {r.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          ),
        }}
      />
      <Modal
        title={`编辑套餐 · ${editPlan?.name}`}
        open={!!editPlan}
        onCancel={() => setEditPlan(null)}
        onOk={savePlan}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="price" label="年费（元）" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="publishLimit" label="供需发布上限（-1 为不限）" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="enabled" label="是否上架" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export function MemberOrdersPage() {
  const list = usePagedList(fetchMemberOrders);
  const [confirming, setConfirming] = useState<string | null>(null);

  const onConfirm = async (id: string) => {
    setConfirming(id);
    try {
      await confirmMemberOrder(id);
      message.success('已确认支付并开通会员');
      list.reload();
    } catch (e) {
      message.error(e instanceof Error ? e.message : '操作失败');
    } finally {
      setConfirming(null);
    }
  };

  const columns: ColumnsType<MemberOrder> = [
    { title: '订单号', dataIndex: 'orderNo', width: 160 },
    { title: '用户', dataIndex: 'nickname', width: 120 },
    { title: '套餐', dataIndex: 'planName', width: 110 },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 90,
      render: (a) => `¥${a}`,
    },
    {
      title: '支付渠道',
      dataIndex: 'payChannel',
      width: 100,
      render: (c) => payChannelMap[c] ?? c,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (s) => {
        const map: Record<string, { color: string; text: string }> = {
          paid: { color: 'success', text: '已支付' },
          pending: { color: 'warning', text: '待支付' },
          refunded: { color: 'default', text: '已退款' },
          closed: { color: 'default', text: '已关闭' },
        };
        const item = map[s] ?? { color: 'default', text: s };
        return <Tag color={item.color}>{item.text}</Tag>;
      },
    },
    { title: '支付时间', dataIndex: 'paidAt', width: 150 },
    {
      title: '会员到期',
      dataIndex: 'expireDate',
      width: 120,
      render: (v: string | undefined) => formatExpireLabel(v),
    },
    { title: '下单时间', dataIndex: 'createdAt', width: 120 },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (_, row) =>
        row.status === 'pending' ? (
          <Button
            type="link"
            size="small"
            loading={confirming === row.id}
            onClick={() => onConfirm(row.id)}
          >
            确认收款
          </Button>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <ListPageShell
      title="付费订单"
      description="微信支付、对公转账及后台开通记录；待支付订单可人工确认收款并开通会员。"
      columns={columns}
      loading={list.loading}
      data={list.data}
      keyword={list.keyword}
      onKeywordChange={list.setKeyword}
      status={list.status ?? ''}
      onStatusChange={(v) => list.setStatus(v)}
      statusOptions={orderStatusOptions}
      onPageChange={list.onPageChange}
      onReload={list.reload}
      rowKey="id"
    />
  );
}
