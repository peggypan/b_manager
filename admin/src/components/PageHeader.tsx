import { Typography } from 'antd';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  description?: string;
  extra?: ReactNode;
};

export function PageHeader({ title, description, extra }: Props) {
  return (
    <div className="page-header">
      <div className="page-header-main">
        <Typography.Title level={4} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        {description && (
          <Typography.Paragraph type="secondary" style={{ margin: '6px 0 0' }}>
            {description}
          </Typography.Paragraph>
        )}
      </div>
      {extra && <div className="page-header-extra">{extra}</div>}
    </div>
  );
}
