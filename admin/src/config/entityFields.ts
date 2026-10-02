import type { ReactNode } from 'react';
import type { AdminResource } from '../api/types';
import { getCreateInitialValues } from './createFormPresets';
import { CONTACT_FIELD_KEYS, contactEntityFields } from './contactFields';

export type FieldEditType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'status'
  | 'tags'
  | 'select'
  | 'date'
  | 'image'
  | 'images';

export interface EntityFieldDef {
  key: string;
  label: string;
  span?: number;
  viewOnly?: boolean;
  /** 与小程序发布页 placeholder 对齐 */
  placeholder?: string;
  editType?: FieldEditType;
  selectOptions?: { value: string; label: string }[];
  /** 表单提交前：字符串 → 存库值 */
  parse?: (raw: unknown) => unknown;
  /** 加载后：存库值 → 表单值 */
  format?: (value: unknown) => unknown;
  renderView?: (value: unknown) => ReactNode;
}

export interface EntityResourceConfig {
  resource: AdminResource;
  viewTitle: string;
  editTitle: string;
  createTitle?: string;
  /** 新增表单默认值（Mock / 云函数 create 也会参考） */
  createInitialValues?: Record<string, unknown>;
  fields: EntityFieldDef[];
  editableKeys: string[];
}

const statusOptions = [
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'published', label: '已发布（C端展示）' },
  { value: 'rejected', label: '已驳回' },
  { value: 'offline', label: '已下架' },
];

const publishTypeOptions = [
  { value: 'factory_info', label: '工厂信息（找工厂列表）' },
  { value: 'factory', label: '工厂需求（供需市场）' },
  { value: 'order', label: '找订单·产品方案' },
  { value: 'order_demand', label: '找订单·需求大厅' },
  { value: 'invest', label: '创投项目' },
  { value: 'storeSupply', label: '门店货源' },
  { value: 'storeDemand', label: '门店求购' },
  { value: 'directory', label: '宠业展厅入驻' },
  { value: 'industry', label: '产业园/商协会' },
  { value: 'community', label: '社区笔记' },
];

const orgTypeOptions = [
  { value: '产业园', label: '产业园' },
  { value: '商协会', label: '商协会' },
];

const directoryTypeOptions = ['工厂', '品牌', '商家'].map((v) => ({ value: v, label: v }));

function tagsField(key: string, label: string): EntityFieldDef {
  return {
    key,
    label,
    editType: 'tags',
    format: (v) => (Array.isArray(v) ? v.join('、') : v ?? ''),
    parse: (raw) =>
      String(raw ?? '')
        .split(/[,、，]/)
        .map((s) => s.trim())
        .filter(Boolean),
  };
}

export const entityResourceConfigs: Record<AdminResource, EntityResourceConfig> = {
  publish: {
    resource: 'publish',
    viewTitle: '供需发布详情',
    editTitle: '修改发布信息',
    editableKeys: [
      'type',
      'title',
      'publisher',
      'summary',
      'content',
      'category',
      'region',
      'moq',
      'bizTypes',
      'tags',
      'capacity',
      'cert',
      'samplePolicy',
      'orgType',
      ...CONTACT_FIELD_KEYS,
      'auditNote',
    ],
    fields: [
      {
        key: 'type',
        label: '发布类型',
        editType: 'select',
        selectOptions: publishTypeOptions,
        viewOnly: false,
      },
      { key: 'title', label: '标题', span: 2, editType: 'text' },
      { key: 'publisher', label: '发布方', editType: 'text' },
      { key: 'createdAt', label: '发布时间', viewOnly: true },
      { key: 'status', label: '审核状态', editType: 'status', viewOnly: true },
      { key: 'summary', label: '摘要', span: 2, editType: 'textarea' },
      { key: 'content', label: '详细说明', span: 2, editType: 'textarea' },
      { key: 'category', label: '品类', editType: 'text' },
      { key: 'region', label: '地区', editType: 'text' },
      { key: 'moq', label: '起订量', editType: 'text' },
      tagsField('bizTypes', '业务类型'),
      tagsField('tags', '能力标签'),
      { key: 'capacity', label: '产能', editType: 'text' },
      { key: 'cert', label: '资质认证', editType: 'text' },
      { key: 'samplePolicy', label: '样品政策', editType: 'text' },
      {
        key: 'orgType',
        label: '机构类型',
        editType: 'select',
        selectOptions: orgTypeOptions,
      },
      ...contactEntityFields,
      { key: 'auditNote', label: '审核备注（内部）', span: 2, editType: 'textarea' },
    ],
  },
  community: {
    resource: 'community',
    viewTitle: '社区帖子详情',
    editTitle: '修改帖子信息',
    editableKeys: [
      'category',
      'title',
      'author',
      'content',
      ...CONTACT_FIELD_KEYS,
      'auditNote',
      'infoHidden',
    ],
    fields: [
      { key: 'category', label: '分类', editType: 'text' },
      { key: 'title', label: '标题', span: 2, editType: 'text' },
      { key: 'author', label: '作者', editType: 'text' },
      ...contactEntityFields,
      { key: 'infoHidden', label: 'C 端隐藏敏感信息', editType: 'boolean' },
      { key: 'time', label: '发布时间', viewOnly: true },
      { key: 'likes', label: '点赞', viewOnly: true },
      { key: 'comments', label: '评论', viewOnly: true },
      { key: 'status', label: '审核状态', editType: 'status', viewOnly: true },
      { key: 'content', label: '正文', span: 2, editType: 'textarea' },
      { key: 'auditNote', label: '审核备注（内部）', span: 2, editType: 'textarea' },
    ],
  },
  factories: {
    resource: 'factories',
    viewTitle: '工厂详情',
    editTitle: '修改工厂信息',
    createTitle: '新增工厂',
    createInitialValues: getCreateInitialValues('factories'),
    editableKeys: [
      'name',
      'category',
      'region',
      'bizTypes',
      'tags',
      'moq',
      'intro',
      'capacity',
      'cert',
      'samplePolicy',
      'publisher',
      ...CONTACT_FIELD_KEYS,
      'status',
    ],
    fields: [
      { key: 'name', label: '工厂名称', span: 2, editType: 'text' },
      { key: 'category', label: '品类', editType: 'text' },
      { key: 'region', label: '地区', editType: 'text' },
      tagsField('bizTypes', '业务类型'),
      tagsField('tags', '能力标签'),
      { key: 'moq', label: '起订量', editType: 'text' },
      { key: 'intro', label: '简介', span: 2, editType: 'textarea' },
      { key: 'capacity', label: '产能', editType: 'text' },
      { key: 'cert', label: '资质认证', editType: 'text' },
      { key: 'samplePolicy', label: '样品政策', editType: 'text' },
      { key: 'publisher', label: '发布方', editType: 'text' },
      { key: 'createdAt', label: '发布时间', viewOnly: true },
      ...contactEntityFields,
      { key: 'status', label: '状态', editType: 'status' },
    ],
  },
  orders: {
    resource: 'orders',
    viewTitle: '订单/方案详情',
    editTitle: '修改订单信息',
    createTitle: '新增订单/方案',
    createInitialValues: getCreateInitialValues('orders'),
    editableKeys: [
      'factoryName',
      'title',
      'type',
      'category',
      'moq',
      'price',
      ...CONTACT_FIELD_KEYS,
      'status',
    ],
    fields: [
      { key: 'title', label: '标题', span: 2, editType: 'text' },
      { key: 'factoryName', label: '工厂', editType: 'text' },
      { key: 'type', label: '类型', editType: 'text' },
      { key: 'category', label: '品类', editType: 'text' },
      { key: 'moq', label: '起订', editType: 'text' },
      { key: 'price', label: '价格', editType: 'text' },
      ...contactEntityFields,
      { key: 'status', label: '状态', editType: 'status' },
    ],
  },
  storeSupply: {
    resource: 'storeSupply',
    viewTitle: '门店货源详情',
    editTitle: '修改货源信息',
    createTitle: '新增门店货源',
    createInitialValues: getCreateInitialValues('storeSupply'),
    editableKeys: [
      'name',
      'factoryName',
      'category',
      'origin',
      'price',
      'dropship',
      ...CONTACT_FIELD_KEYS,
      'status',
    ],
    fields: [
      { key: 'name', label: '商品', span: 2, editType: 'text' },
      { key: 'factoryName', label: '工厂', editType: 'text' },
      { key: 'category', label: '品类', editType: 'text' },
      { key: 'origin', label: '产地', editType: 'text' },
      { key: 'price', label: '代发价（元）', editType: 'number' },
      { key: 'dropship', label: '一件代发', editType: 'boolean' },
      ...contactEntityFields,
      { key: 'status', label: '状态', editType: 'status' },
    ],
  },
  storeDemands: {
    resource: 'storeDemands',
    viewTitle: '门店求购详情',
    editTitle: '修改求购信息',
    createTitle: '新增门店求购',
    createInitialValues: getCreateInitialValues('storeDemands'),
    editableKeys: [
      'title',
      'storeName',
      'category',
      'region',
      'time',
      ...CONTACT_FIELD_KEYS,
      'status',
    ],
    fields: [
      { key: 'title', label: '求购标题', span: 2, editType: 'text' },
      { key: 'storeName', label: '门店', editType: 'text' },
      { key: 'category', label: '品类', editType: 'text' },
      { key: 'region', label: '地区', editType: 'text' },
      { key: 'time', label: '发布时间', editType: 'date' },
      ...contactEntityFields,
      { key: 'status', label: '状态', editType: 'status' },
    ],
  },
  projects: {
    resource: 'projects',
    viewTitle: '创投项目详情',
    editTitle: '修改项目信息',
    createTitle: '新增创投项目',
    createInitialValues: getCreateInitialValues('projects'),
    editableKeys: ['name', 'track', 'stage', 'need', ...CONTACT_FIELD_KEYS, 'status'],
    fields: [
      { key: 'name', label: '项目名称', span: 2, editType: 'text' },
      { key: 'track', label: '赛道', editType: 'text' },
      { key: 'stage', label: '阶段', editType: 'text' },
      { key: 'need', label: '融资/合作需求', span: 2, editType: 'textarea' },
      ...contactEntityFields,
      { key: 'status', label: '状态', editType: 'status' },
    ],
  },
  influencers: {
    resource: 'influencers',
    viewTitle: '达人资源详情',
    editTitle: '修改达人信息',
    createTitle: '新增达人资源',
    createInitialValues: getCreateInitialValues('influencers'),
    editableKeys: [
      'name',
      'platform',
      'fans',
      'category',
      'mode',
      ...CONTACT_FIELD_KEYS,
      'status',
    ],
    fields: [
      { key: 'name', label: '达人', span: 2, editType: 'text' },
      { key: 'platform', label: '平台', editType: 'text' },
      { key: 'fans', label: '粉丝', editType: 'text' },
      { key: 'category', label: '垂类', editType: 'text' },
      { key: 'mode', label: '合作模式', editType: 'text' },
      ...contactEntityFields,
      { key: 'status', label: '状态', editType: 'status' },
    ],
  },
  directory: {
    resource: 'directory',
    viewTitle: '展厅黄页详情',
    editTitle: '修改黄页信息',
    createTitle: '新增展厅黄页',
    createInitialValues: getCreateInitialValues('directory'),
    editableKeys: [
      'name',
      'type',
      'category',
      'region',
      'intro',
      'products',
      ...CONTACT_FIELD_KEYS,
      'status',
    ],
    fields: [
      { key: 'name', label: '名称', span: 2, editType: 'text' },
      { key: 'type', label: '类型', editType: 'select', selectOptions: directoryTypeOptions },
      { key: 'category', label: '品类', editType: 'text' },
      { key: 'region', label: '地区', editType: 'text' },
      { key: 'intro', label: '简介', span: 2, editType: 'textarea' },
      { key: 'products', label: '主营产品/服务', span: 2, editType: 'textarea' },
      ...contactEntityFields,
      { key: 'status', label: '状态', editType: 'status' },
    ],
  },
  industryOrgs: {
    resource: 'industryOrgs',
    viewTitle: '产业园/商协会详情',
    editTitle: '修改机构信息',
    createTitle: '新增产业园/商协会',
    createInitialValues: getCreateInitialValues('industryOrgs'),
    editableKeys: [
      'name',
      'type',
      'region',
      'scale',
      'intro',
      'products',
      'cert',
      ...CONTACT_FIELD_KEYS,
      'status',
    ],
    fields: [
      { key: 'name', label: '名称', span: 2, editType: 'text' },
      { key: 'type', label: '类型', editType: 'select', selectOptions: orgTypeOptions },
      { key: 'region', label: '地区', editType: 'text' },
      { key: 'scale', label: '规模', span: 2, editType: 'text' },
      { key: 'intro', label: '机构简介', span: 2, editType: 'textarea' },
      { key: 'products', label: '主要服务', span: 2, editType: 'textarea' },
      { key: 'cert', label: '资质认证', editType: 'text' },
      ...contactEntityFields,
      { key: 'status', label: '状态', editType: 'status' },
    ],
  },
  banners: {
    resource: 'banners',
    viewTitle: '轮播图详情',
    editTitle: '修改轮播图',
    createTitle: '新增轮播图',
    createInitialValues: getCreateInitialValues('banners'),
    editableKeys: ['sort', 'title', 'image', 'link', 'enabled'],
    fields: [
      { key: 'sort', label: '排序', editType: 'number' },
      { key: 'enabled', label: '启用', editType: 'boolean' },
      { key: 'title', label: '标题', span: 2, editType: 'text' },
      { key: 'image', label: '轮播图片', span: 2, editType: 'image' },
      { key: 'link', label: '跳转链接', span: 2, editType: 'text' },
    ],
  },
  mediaServices: {
    resource: 'mediaServices',
    viewTitle: '新媒体服务详情',
    editTitle: '修改服务信息',
    createTitle: '新增新媒体服务',
    createInitialValues: getCreateInitialValues('mediaServices'),
    editableKeys: ['name', 'price', 'image', 'desc', ...CONTACT_FIELD_KEYS, 'enabled'],
    fields: [
      { key: 'name', label: '服务名称', span: 2, editType: 'text' },
      { key: 'price', label: '价格', editType: 'text' },
      { key: 'image', label: '封面图', span: 2, editType: 'image' },
      { key: 'enabled', label: '上架', editType: 'boolean' },
      { key: 'desc', label: '说明', span: 2, editType: 'textarea' },
      ...contactEntityFields,
    ],
  },
};

export { statusOptions };
