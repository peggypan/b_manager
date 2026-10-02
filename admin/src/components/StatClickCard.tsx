import { Card } from 'antd';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  className?: string;
  children: ReactNode;
  /** 跳转路由，与 onClick 二选一 */
  to?: string;
  onClick?: () => void;
  title?: string;
};

export function StatClickCard({ className = '', children, to, onClick, title }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    else onClick?.();
  };

  return (
    <Card
      className={`stat-card stat-card-clickable ${className}`.trim()}
      variant="borderless"
      hoverable
      onClick={handleClick}
      title={title}
    >
      {children}
    </Card>
  );
}
