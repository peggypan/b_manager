import { EyeOutlined, FormOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Descriptions,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Tag,
  Typography,
} from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AdminResource, AuditStatus, EntityModalMode } from '../api/types';
import { getFieldHint } from '../config/createFormPresets';
import { entityResourceConfigs, statusOptions } from '../config/entityFields';
import { createAdminRecord, getAdminRecord, updateAdminRecord } from '../services/adminApi';
import { AdminImageUpload, AdminImagesUpload } from './AdminImageUpload';
import { StatusTag } from './StatusTag';

type Props = {
  resource: AdminResource;
  recordId: number | null;
  mode: EntityModalMode;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

function toFormFieldValue(f: { editType?: string; format?: (v: unknown) => unknown }, raw: unknown) {
  if (f.format) return f.format(raw);
  if (f.editType === 'date' && raw) return dayjs(String(raw));
  return raw;
}

function toStoreFieldValue(
  f: { editType?: string; parse?: (v: unknown) => unknown },
  value: unknown,
) {
  if (f.parse) return f.parse(value);
  if (f.editType === 'date' && value && dayjs.isDayjs(value)) {
    return (value as Dayjs).format('YYYY-MM-DD');
  }
  return value;
}

function formatViewValue(key: string, value: unknown): ReactNode {
  if (value === undefined || value === null || value === '') return '—';
  if (key === 'status') return <StatusTag status={String(value) as AuditStatus} />;
  if (key === 'type' && typeof value === 'string') {
    const cfg = entityResourceConfigs.publish.fields.find((f) => f.key === 'type');
    const label = cfg?.selectOptions?.find((o) => o.value === value)?.label;
    return label ? <Tag>{label}</Tag> : value;
  }
  if (Array.isArray(value)) {
    if (key === 'images' && value.every((x) => typeof x === 'string')) {
      return (
        <Image.PreviewGroup>
          <Space wrap>
            {(value as string[]).map((src) => (
              <Image key={src} src={src} width={120} height={90} style={{ objectFit: 'cover' }} />
            ))}
          </Space>
        </Image.PreviewGroup>
      );
    }
    return (
      <Space wrap size={4}>
        {value.map((x) => (
          <Tag key={String(x)}>{String(x)}</Tag>
        ))}
      </Space>
    );
  }
  if (typeof value === 'boolean') return value ? '是' : '否';
  if (key === 'image' && typeof value === 'string') {
    return (
      <Image src={value} width={160} height={68} style={{ objectFit: 'cover', borderRadius: 4 }} />
    );
  }
  return String(value);
}

export function EntityDetailModal({ resource, recordId, mode, open, onClose, onSaved }: Props) {
  const config = entityResourceConfigs[resource];
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);
  const [form] = Form.useForm();

  const editFields = useMemo(
    () => config.fields.filter((f) => !f.viewOnly && config.editableKeys.includes(f.key)),
    [config],
  );

  const isCreate = mode === 'create';

  useEffect(() => {
    if (!open) {
      setDetail(null);
      return;
    }
    if (isCreate) {
      const initial = { ...(config.createInitialValues ?? {}) };
      setDetail(initial);
      const formValues: Record<string, unknown> = {};
      editFields.forEach((f) => {
        const raw = initial[f.key];
        if (raw === undefined) {
          if (f.editType === 'boolean') formValues[f.key] = false;
          else if (f.editType === 'tags') formValues[f.key] = '';
          return;
        }
        formValues[f.key] = toFormFieldValue(f, raw);
      });
      form.setFieldsValue(formValues);
      setLoading(false);
      return;
    }
    if (recordId === null) {
      setDetail(null);
      return;
    }
    setLoading(true);
    getAdminRecord<Record<string, unknown>>(resource, recordId)
      .then((data) => {
        setDetail(data);
        const formValues: Record<string, unknown> = {};
        editFields.forEach((f) => {
          const raw = data[f.key];
          formValues[f.key] = toFormFieldValue(f, raw);
        });
        form.setFieldsValue(formValues);
      })
      .finally(() => setLoading(false));
  }, [open, recordId, resource, form, editFields, isCreate, config.createInitialValues]);

  const buildPayload = (values: Record<string, unknown>) => {
    const payload: Record<string, unknown> = {};
    editFields.forEach((f) => {
      if (values[f.key] === undefined) return;
      payload[f.key] = toStoreFieldValue(f, values[f.key]);
    });
    return payload;
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const payload = buildPayload(values);
    setSaving(true);
    try {
      if (isCreate) {
        await createAdminRecord(resource, payload);
      } else {
        if (recordId === null) return;
        await updateAdminRecord(resource, recordId, payload);
      }
      onSaved?.();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const modalTitle =
    mode === 'view'
      ? config.viewTitle
      : isCreate
        ? (config.createTitle ?? config.editTitle.replace(/^修改/, '新增'))
        : config.editTitle;

  const renderFormItem = (f: (typeof config.fields)[number]) => {
    const type = f.editType ?? 'text';
    const ph = getFieldHint(resource, f.key, f.placeholder);
    switch (type) {
      case 'textarea':
        return <Input.TextArea rows={3} placeholder={ph} />;
      case 'number':
        return <InputNumber style={{ width: '100%' }} placeholder={ph} />;
      case 'boolean':
        return <Switch />;
      case 'status':
        return <Select options={statusOptions} placeholder={ph ?? '请选择状态'} />;
      case 'select':
        return <Select options={f.selectOptions} placeholder={ph ?? '请选择'} />;
      case 'tags':
        return <Input placeholder={ph ?? '多个用逗号或顿号分隔'} />;
      case 'date':
        return (
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            placeholder={ph ?? '选择日期'}
          />
        );
      case 'image':
        return <AdminImageUpload urlPlaceholder={ph ?? '或粘贴图片链接（https://…）'} />;
      case 'images':
        return <AdminImagesUpload maxCount={9} />;
      default:
        return <Input placeholder={ph} />;
    }
  };

  return (
    <Modal
      title={
        <Space>
          {mode === 'view' ? <EyeOutlined /> : <FormOutlined />}
          {modalTitle}
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={720}
      destroyOnHidden
      footer={
        mode === 'edit' || isCreate ? (
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" loading={saving} onClick={handleSave}>
              {isCreate ? '保存新增' : '保存修改'}
            </Button>
          </Space>
        ) : (
          <Button onClick={onClose}>关闭</Button>
        )
      }
    >
      {loading || (!isCreate && !detail) ? (
        <Typography.Text type="secondary">加载中…</Typography.Text>
      ) : mode === 'view' && detail ? (
        <Descriptions column={2} bordered size="small">
          {config.fields.map((f) => (
            <Descriptions.Item key={f.key} label={f.label} span={f.span ?? 1}>
              {f.renderView
                ? f.renderView(detail[f.key])
                : formatViewValue(f.key, detail[f.key])}
            </Descriptions.Item>
          ))}
        </Descriptions>
      ) : (
        <Form form={form} layout="vertical">
          {isCreate ? (
            <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
              输入框内灰色文字为填写参考（与小程序端一致），请填写实际内容后保存。
            </Typography.Paragraph>
          ) : null}
          {editFields.map((f) => (
            <Form.Item
              key={f.key}
              name={f.key}
              label={f.label}
              valuePropName={f.editType === 'boolean' ? 'checked' : 'value'}
            >
              {renderFormItem(f)}
            </Form.Item>
          ))}
        </Form>
      )}
    </Modal>
  );
}
