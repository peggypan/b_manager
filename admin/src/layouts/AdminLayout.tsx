import {
  AuditOutlined,
  BankOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  ShopOutlined,
  TeamOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Badge, Breadcrumb, Layout, Menu, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { isMockMode } from '../api/client';
import { breadcrumbItems } from '../config/routeMeta';
import { useAuth } from '../context/AuthContext';
import { fetchDashboard } from '../services/adminApi';

const { Header, Sider, Content } = Layout;

function openKeysFromPath(pathname: string) {
  if (pathname.startsWith('/audit')) return ['audit'];
  if (pathname.startsWith('/content')) return ['content'];
  if (pathname.startsWith('/users') || pathname.startsWith('/members')) return ['user'];
  if (pathname.startsWith('/finance')) return ['finance'];
  return [];
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [openKeys, setOpenKeys] = useState<string[]>(() => openKeysFromPath(location.pathname));
  const [pendingAudit, setPendingAudit] = useState(0);
  const [pendingReceipts, setPendingReceipts] = useState(0);

  useEffect(() => {
    setOpenKeys(openKeysFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    fetchDashboard()
      .then((d) => {
        setPendingAudit(d.pendingCompanyAudit + d.pendingPublishAudit + d.pendingCommunityAudit);
        setPendingReceipts(d.pendingReceipts);
      })
      .catch(() => {
        setPendingAudit(0);
        setPendingReceipts(0);
      });
  }, [location.pathname]);

  const menuItems = useMemo(
    () => [
      { key: '/dashboard', icon: <DashboardOutlined />, label: '工作台' },
      {
        key: 'audit',
        icon: <AuditOutlined />,
        label: (
          <span className="menu-label-with-badge">
            审核中心
            {pendingAudit > 0 && (
              <Badge count={pendingAudit} size="small" offset={[6, 0]} color="#f59e0b" />
            )}
          </span>
        ),
        children: [
          { key: '/audit/company', label: '展厅入驻（工厂/品牌/商家）' },
          { key: '/audit/publish', label: '会员发布管理' },
          { key: '/audit/community', label: '社区帖子' },
        ],
      },
      {
        key: 'content',
        icon: <FileTextOutlined />,
        label: '内容管理',
        children: [
          { key: '/content/factories', label: '找工厂' },
          { key: '/content/orders', label: '找订单' },
          { key: '/content/store-supply', label: '门店货源' },
          { key: '/content/store-demands', label: '门店求购' },
          { key: '/content/invest', label: '创投项目' },
          { key: '/content/influencers', label: '达人资源' },
          { key: '/content/directory', label: '宠业展厅' },
          { key: '/content/industry', label: '产业园/商协会' },
          { key: '/content/banners', label: '首页轮播' },
          { key: '/content/media', label: '新媒体服务' },
        ],
      },
      {
        key: 'user',
        icon: <TeamOutlined />,
        label: '用户与会员',
        children: [
          { key: '/users', label: '小程序用户' },
          { key: '/members/paid', label: '付费会员' },
          { key: '/members/plans', label: '套餐配置' },
          { key: '/members/orders', label: '付费订单' },
        ],
      },
      {
        key: 'finance',
        icon: <WalletOutlined />,
        label: (
          <span className="menu-label-with-badge">
            财务中心
            {pendingReceipts > 0 && (
              <Badge count={pendingReceipts} size="small" offset={[6, 0]} color="#ef4444" />
            )}
          </span>
        ),
        children: [{ key: '/finance/receipts', label: '收款管理' }],
      },
    ],
    [pendingAudit, pendingReceipts],
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={240} theme="dark" breakpoint="lg" collapsedWidth={64}>
        <div className="brand-block">
          <span className="brand-icon">🐾</span>
          <div>
            <div className="brand-title">宠投投</div>
            <div className="brand-sub">运营管理后台</div>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          onClick={({ key }) => {
            if (!key.startsWith('/')) return;
            navigate(key);
          }}
        />
      </Sider>
      <Layout>
        <Header className="admin-header">
          <div className="header-left">
            <ShopOutlined style={{ color: '#1A56DB', fontSize: 18 }} />
            <Typography.Text strong>宠投投 · B端撮合管理端</Typography.Text>
            {isMockMode() && (
              <Tag color="processing" variant="filled">
                Mock 数据
              </Tag>
            )}
          </div>
          <div className="header-right">
            <BankOutlined />
            <span>{user?.displayName ?? '管理员'}</span>
            <LogoutOutlined
              title="退出登录"
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </Header>
        <Content className="admin-content">
          <Breadcrumb items={breadcrumbItems(location.pathname)} style={{ marginBottom: 16 }} />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
