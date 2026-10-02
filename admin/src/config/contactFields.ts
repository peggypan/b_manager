import type { ColumnsType } from 'antd/es/table';
import type { EntityFieldDef } from './entityFields';

/** 与小程序、云库对齐的联系方式字段 */
export interface ContactFields {
  contact?: string;
  phone?: string;
  wechat?: string;
}

export const CONTACT_FIELD_KEYS = ['contact', 'phone', 'wechat'] as const;

export const contactEntityFields: EntityFieldDef[] = [
  { key: 'contact', label: '联系人', editType: 'text' },
  { key: 'phone', label: '联系电话', editType: 'text' },
  { key: 'wechat', label: '微信号', editType: 'text' },
];

const dash = (v?: string) => (v && String(v).trim() ? v : '—');

/** 列表页统一三列：联系人 / 手机号 / 微信号 */
export function contactTableColumns<T extends ContactFields>(): ColumnsType<T> {
  return [
    { title: '联系人', dataIndex: 'contact', width: 96, ellipsis: true, render: dash },
    { title: '联系电话', dataIndex: 'phone', width: 120, ellipsis: true, render: dash },
    { title: '微信号', dataIndex: 'wechat', width: 110, ellipsis: true, render: dash },
  ];
}
