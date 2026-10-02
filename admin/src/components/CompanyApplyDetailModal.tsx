import { EyeOutlined, FormOutlined } from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import type { CompanyApply } from '../api/types';
import { getCompanyApply, updateCompanyApply } from '../services/adminApi';
import { AdminImagesUpload } from './AdminImageUpload';
import { StatusTag } from './StatusTag';

const typeOptions = ['工厂', '品牌', '商家'].map((v) => ({ value: v, label: v }));

type Props = {
  applyId: number | null;
  mode: 'view' | 'edit';
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

export function CompanyApplyDetailModal({ applyId, mode, open, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<CompanyApply | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open || !applyId) {
      setDetail(null);
      return;
    }
    setLoading(true);
    getCompanyApply(applyId)
      .then((data) => {
        setDetail(data);
        form.setFieldsValue(data);
      })
      .finally(() => setLoading(false));
  }, [open, applyId, form]);

  const handleSave = async () => {
    if (!applyId) return;
    const values = await form.validateFields();
    setSaving(true);
    try {
      await updateCompanyApply(applyId, values);
      onSaved?.();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          {mode === 'view' ? <EyeOutlined /> : <FormOutlined />}
          {mode === 'view' ? '企业入驻详情' : '修改入驻信息'}
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={720}
      destroyOnHidden
      footer={
        mode === 'edit' ? (
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" loading={saving} onClick={handleSave}>
              保存修改
            </Button>
          </Space>
        ) : (
          <Button onClick={onClose}>关闭</Button>
        )
      }
    >
      {loading || !detail ? (
        <Typography.Text type="secondary">加载中…</Typography.Text>
      ) : mode === 'view' ? (
        <>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="企业名称" span={2}>
              {detail.name}
            </Descriptions.Item>
            <Descriptions.Item label="主体类型">{detail.type}</Descriptions.Item>
            <Descriptions.Item label="审核状态">
              <StatusTag status={detail.status} />
            </Descriptions.Item>
            <Descriptions.Item label="主营品类">{detail.category || '—'}</Descriptions.Item>
            <Descriptions.Item label="所在地区">{detail.region || '—'}</Descriptions.Item>
            <Descriptions.Item label="联系人">{detail.contact}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{detail.phone}</Descriptions.Item>
            <Descriptions.Item label="微信">{detail.wechat || '—'}</Descriptions.Item>
            <Descriptions.Item label="申请时间">{detail.applyTime}</Descriptions.Item>
            <Descriptions.Item label="企业简介" span={2}>
              {detail.intro || '—'}
            </Descriptions.Item>
            <Descriptions.Item label="主营产品/服务" span={2}>
              {detail.products || '—'}
            </Descriptions.Item>
            <Descriptions.Item label="审核备注" span={2}>
              {detail.auditNote || '—'}
            </Descriptions.Item>
          </Descriptions>
          {detail.images && detail.images.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Typography.Text strong>企业展示图片</Typography.Text>
              <Image.PreviewGroup>
                <Space wrap style={{ marginTop: 8 }}>
                  {detail.images.map((url) => (
                    <Image key={url} src={url} width={120} height={90} style={{ objectFit: 'cover' }} />
                  ))}
                </Space>
              </Image.PreviewGroup>
            </div>
          )}
          {detail.videoUrl && (
            <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
              已上传企业视频（接入云存储后可在此预览）
            </Typography.Paragraph>
          )}
        </>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="企业名称" rules={[{ required: true, message: '请输入企业名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="主体类型" rules={[{ required: true }]}>
            <Select options={typeOptions} />
          </Form.Item>
          <Form.Item name="category" label="主营品类">
            <Input placeholder="如：主粮、零食" />
          </Form.Item>
          <Form.Item name="region" label="所在地区">
            <Input placeholder="如：广东广州" />
          </Form.Item>
          <Form.Item name="contact" label="联系人" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="联系电话" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="wechat" label="微信">
            <Input />
          </Form.Item>
          <Form.Item name="intro" label="企业简介">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="products" label="主营产品/服务">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="auditNote" label="审核备注（内部）">
            <Input.TextArea rows={2} placeholder="驳回原因或内部说明" />
          </Form.Item>
          <Form.Item
            name="images"
            label="企业展示图片"
            extra="支持本地上传，保存后同步至小程序展示（Mock 为 base64 预览）"
          >
            <AdminImagesUpload maxCount={6} />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
