import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isMockMode } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-hero">
          <div className="login-badge">宠投投 · Admin</div>
          <Typography.Title level={2} style={{ color: '#fff', marginBottom: 8 }}>
            运营管理后台
          </Typography.Title>
          <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.82)', maxWidth: 360 }}>
            对接微信小程序云开发与云数据库，统一管理入驻审核、供需内容、社区与会员数据。
          </Typography.Paragraph>
        </div>
        <Card className="login-card" variant="borderless">
          <Typography.Title level={4} style={{ marginTop: 0 }}>
            登录
          </Typography.Title>
          {isMockMode() && (
            <Alert
              type="info"
              showIcon
              title="演示账号：admin / admin123"
              style={{ marginBottom: 16 }}
            />
          )}
          {error && (
            <Alert type="error" title={error} style={{ marginBottom: 16 }} showIcon />
          )}
          <Form
            layout="vertical"
            initialValues={{ username: 'admin', password: 'admin123' }}
            onFinish={async (values) => {
              setLoading(true);
              setError('');
              try {
                await login(values.username, values.password);
                navigate('/dashboard', { replace: true });
              } catch (e) {
                setError(e instanceof Error ? e.message : '登录失败');
              } finally {
                setLoading(false);
              }
            }}
          >
            <Form.Item
              name="username"
              label="账号"
              rules={[{ required: true, message: '请输入账号' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="管理员账号" size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              进入后台
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}
