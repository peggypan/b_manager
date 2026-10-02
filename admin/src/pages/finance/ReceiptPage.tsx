import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';
import { ListPageShell } from '../../components/ListPageShell';
import { useListStatusFromSearchParam } from '../../hooks/useListStatusFromSearchParam';
import { usePagedList } from '../../hooks/usePagedList';
import type { PaymentReceipt, ReceiptBizType, ReceiptStatus } from '../../api/types';
import {
  confirmPaymentReceipt,
  createPaymentReceipt,
  fetchPaymentReceipts,
  getPaymentReceipt,
  refundPaymentReceipt,
} from '../../services/adminApi';

const receiptStatusOptions = [
  { value: '', label: '全部状态' },
  { value: 'pending', label: '待确认' },
  { value: 'confirmed', label: '已收款' },
  { value: 'refunded', label: '已退款' },
  { value: 'cancelled', label: '已取消' },
];

const bizTypeOptions = [
  { value: '', label: '全部业务' },
  { value: 'membership', label: '会员费' },
  { value: 'media_service', label: '新媒体服务' },
  { value: 'deposit', label: '定金/展位' },
  { value: 'other', label: '其他' },
];

const bizTypeLabel: Record<ReceiptBizType, string> = {
  membership: '会员费',
  media_service: '新媒体服务',
  deposit: '定金/展位',
  other: '其他',
};

const payChannelMap: Record<string, string> = {
  wechat: '微信支付',
  manual: '后台开通',
  transfer: '对公转账',
};

function statusTag(status: ReceiptStatus) {
  const map: Record<ReceiptStatus, { color: string; text: string }> = {
    pending: { color: 'warning', text: '待确认' },
    confirmed: { color: 'success', text: '已收款' },
    refunded: { color: 'default', text: '已退款' },
    cancelled: { color: 'default', text: '已取消' },
  };
  const item = map[status];
  return <Tag color={item.color}>{item.text}</Tag>;
}

export default function ReceiptPage() {
  const [bizFilter, setBizFilter] = useState<ReceiptBizType | ''>('');
  const fetcher = useCallback(
    (q: Parameters<typeof fetchPaymentReceipts>[0]) =>
      fetchPaymentReceipts({ ...q, receiptBizType: bizFilter }),
    [bizFilter],
  );
  const list = usePagedList(fetcher, [bizFilter]);
  useListStatusFromSearchParam(list.setStatus);

  const [actionId, setActionId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [viewDetail, setViewDetail] = useState<PaymentReceipt | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm] = Form.useForm();

  const openView = async (id: string) => {
    setViewId(id);
    setViewDetail(null);
    try {
      const data = await getPaymentReceipt(id);
      setViewDetail(data);
    } catch (e) {
      message.error(e instanceof Error ? e.message : '加载失败');
      setViewId(null);
    }
  };

  const runConfirm = async (id: string) => {
    setActionId(id);
    try {
      await confirmPaymentReceipt(id);
      message.success('已确认收款');
      list.reload();
      if (viewId === id) void openView(id);
    } catch (e) {
      message.error(e instanceof Error ? e.message : '操作失败');
    } finally {
      setActionId(null);
    }
  };

  const runRefund = async (id: string) => {
    setActionId(id);
    try {
      await refundPaymentReceipt(id);
      message.success('已标记退款');
      list.reload();
      if (viewId === id) void openView(id);
    } catch (e) {
      message.error(e instanceof Error ? e.message : '操作失败');
    } finally {
      setActionId(null);
    }
  };

  const submitCreate = async () => {
    const values = await createForm.validateFields();
    await createPaymentReceipt(values);
    message.success('收款单已登记');
    setCreateOpen(false);
    createForm.resetFields();
    list.reload();
  };

  const columns: ColumnsType<PaymentReceipt> = [
    { title: '收款单号', dataIndex: 'receiptNo', width: 150 },
    {
      title: '业务',
      dataIndex: 'bizType',
      width: 100,
      render: (t: ReceiptBizType) => bizTypeLabel[t] ?? t,
    },
    { title: '说明', dataIndex: 'bizTitle', ellipsis: true, width: 180 },
    { title: '付款方', dataIndex: 'payerName', width: 120, ellipsis: true },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 90,
      render: (a: number) => <span style={{ fontWeight: 600 }}>¥{a.toLocaleString()}</span>,
    },
    {
      title: '渠道',
      dataIndex: 'payChannel',
      width: 96,
      render: (c) => payChannelMap[c] ?? c,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (s: ReceiptStatus) => statusTag(s),
    },
    { title: '收款时间', dataIndex: 'paidAt', width: 140, render: (v) => v ?? '—' },
    { title: '创建时间', dataIndex: 'createdAt', width: 110 },
    {
      title: '操作',
      fixed: 'right',
      width: 200,
      render: (_, row) => (
        <Space size={4} wrap>
          <a onClick={() => openView(row.id)}>查看</a>
          {row.status === 'pending' && (
            <Button
              type="link"
              size="small"
              loading={actionId === row.id}
              onClick={() => runConfirm(row.id)}
            >
              确认收款
            </Button>
          )}
          {row.status === 'confirmed' && (
            <Button
              type="link"
              size="small"
              danger
              loading={actionId === row.id}
              onClick={() => runRefund(row.id)}
            >
              退款
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <ListPageShell
        title="收款管理"
        description="汇总会员费、新媒体服务、定金等收款；待确认项核实后可确认收款，关联会员订单将自动开通。"
        columns={columns}
        loading={list.loading}
        data={list.data}
        keyword={list.keyword}
        onKeywordChange={list.setKeyword}
        status={list.status ?? ''}
        onStatusChange={(v) => list.setStatus(v)}
        statusOptions={receiptStatusOptions}
        onPageChange={list.onPageChange}
        onReload={list.reload}
        rowKey="id"
        toolbarExtra={
          <Space>
            <Select
              style={{ width: 130 }}
              value={bizFilter}
              options={bizTypeOptions}
              onChange={(v) => setBizFilter(v as ReceiptBizType | '')}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
              登记收款
            </Button>
          </Space>
        }
      />

      <Modal
        title="收款单详情"
        open={viewId !== null}
        onCancel={() => {
          setViewId(null);
          setViewDetail(null);
        }}
        footer={
          viewDetail?.status === 'pending' ? (
            <Button
              type="primary"
              loading={actionId === viewDetail.id}
              onClick={() => runConfirm(viewDetail.id)}
            >
              确认收款
            </Button>
          ) : null
        }
        width={640}
        destroyOnHidden
      >
        {viewDetail ? (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="收款单号">{viewDetail.receiptNo}</Descriptions.Item>
            <Descriptions.Item label="状态">{statusTag(viewDetail.status)}</Descriptions.Item>
            <Descriptions.Item label="业务类型">
              {bizTypeLabel[viewDetail.bizType]}
            </Descriptions.Item>
            <Descriptions.Item label="支付渠道">
              {payChannelMap[viewDetail.payChannel] ?? viewDetail.payChannel}
            </Descriptions.Item>
            <Descriptions.Item label="业务说明" span={2}>
              {viewDetail.bizTitle}
            </Descriptions.Item>
            <Descriptions.Item label="付款方">{viewDetail.payerName}</Descriptions.Item>
            <Descriptions.Item label="金额">¥{viewDetail.amount.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="收款时间">{viewDetail.paidAt ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="确认时间">{viewDetail.confirmedAt ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{viewDetail.createdAt}</Descriptions.Item>
            <Descriptions.Item label="关联会员订单">
              {viewDetail.memberOrderId ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {viewDetail.remark ?? '—'}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          '加载中…'
        )}
      </Modal>

      <Modal
        title="登记收款"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={submitCreate}
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical" initialValues={{ bizType: 'other', payChannel: 'transfer' }}>
          <Form.Item name="bizType" label="业务类型" rules={[{ required: true }]}>
            <Select
              options={bizTypeOptions.filter((o) => o.value !== '').map((o) => ({
                value: o.value,
                label: o.label,
              }))}
            />
          </Form.Item>
          <Form.Item name="bizTitle" label="业务说明" rules={[{ required: true, message: '请输入说明' }]}>
            <Input placeholder="如：线下活动赞助、定制开发首款" />
          </Form.Item>
          <Form.Item name="payerName" label="付款方" rules={[{ required: true }]}>
            <Input placeholder="企业/个人名称" />
          </Form.Item>
          <Form.Item name="amount" label="金额（元）" rules={[{ required: true }]}>
            <InputNumber min={0.01} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="payChannel" label="支付渠道" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'transfer', label: '对公转账' },
                { value: 'wechat', label: '微信支付' },
                { value: 'manual', label: '后台登记' },
              ]}
            />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
