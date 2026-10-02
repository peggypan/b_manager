import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Space, Table } from 'antd';
import type { ReactNode } from 'react';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { PageResult } from '../api/types';
import { PageHeader } from './PageHeader';

const defaultStatusOptions = [
  { value: '', label: '全部状态' },
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已驳回' },
  { value: 'offline', label: '已下架' },
];

type Props<T extends object> = {
  title: string;
  description?: string;
  columns: ColumnsType<T>;
  loading: boolean;
  data: PageResult<T>;
  keyword: string;
  onKeywordChange: (v: string) => void;
  status?: string;
  onStatusChange?: (v: string) => void;
  showStatusFilter?: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onReload?: () => void;
  onCreate?: () => void;
  createLabel?: string;
  statusOptions?: { value: string; label: string }[];
  toolbarExtra?: ReactNode;
  rowKey: string | keyof T | ((record: T) => string);
};

export function ListPageShell<T extends object>({
  title,
  description,
  columns,
  loading,
  data,
  keyword,
  onKeywordChange,
  status = '',
  onStatusChange,
  showStatusFilter = true,
  onPageChange,
  onReload,
  onCreate,
  createLabel = '新增',
  statusOptions = defaultStatusOptions,
  toolbarExtra,
  rowKey,
}: Props<T>) {
  const pagination: TablePaginationConfig = {
    current: data.page,
    pageSize: data.pageSize,
    total: data.total,
    showSizeChanger: true,
    showTotal: (t) => `共 ${t} 条`,
    onChange: onPageChange,
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        extra={
          onCreate || onReload ? (
            <Space>
              {onCreate ? (
                <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                  {createLabel}
                </Button>
              ) : null}
              {onReload ? (
                <Button icon={<ReloadOutlined />} onClick={onReload} loading={loading}>
                  刷新
                </Button>
              ) : null}
            </Space>
          ) : undefined
        }
      />
      <Space wrap className="list-toolbar">
        <Input.Search
          allowClear
          placeholder="关键词搜索"
          style={{ width: 280 }}
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onSearch={(v) => onKeywordChange(v)}
        />
        {showStatusFilter && onStatusChange && (
          <Select
            style={{ width: 140 }}
            value={status}
            options={statusOptions}
            onChange={onStatusChange}
          />
        )}
        {toolbarExtra}
      </Space>
      <Table<T>
        rowKey={rowKey as string}
        loading={loading}
        columns={columns}
        dataSource={data.list}
        pagination={pagination}
        scroll={{ x: 'max-content' }}
        size="middle"
      />
    </div>
  );
}
