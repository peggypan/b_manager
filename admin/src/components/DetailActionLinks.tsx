import { Space } from 'antd';

type Props = {
  id: number;
  onOpen: (id: number, mode: 'view' | 'edit') => void;
};

export function DetailActionLinks({ id, onOpen }: Props) {
  return (
    <Space size={4}>
      <a onClick={() => onOpen(id, 'view')}>查看</a>
      <a onClick={() => onOpen(id, 'edit')}>修改</a>
    </Space>
  );
}
