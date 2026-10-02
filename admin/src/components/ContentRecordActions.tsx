import { Button, Popconfirm, Space } from 'antd';
import { DetailActionLinks } from './DetailActionLinks';

type Props = {
  id: number;
  loading?: boolean;
  onOpen: (id: number, mode: 'view' | 'edit') => void;
  onDelete: (id: number) => void;
};

export function ContentRecordActions({ id, loading, onOpen, onDelete }: Props) {
  return (
    <Space size={4} wrap>
      <DetailActionLinks id={id} onOpen={onOpen} />
      <Popconfirm
        title="删除后不可恢复，确认删除该条内容？"
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        onConfirm={() => onDelete(id)}
      >
        <Button type="link" size="small" danger loading={loading}>
          删除
        </Button>
      </Popconfirm>
    </Space>
  );
}
