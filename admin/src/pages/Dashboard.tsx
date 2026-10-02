import {
  AuditOutlined,
  ArrowRightOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Button, Col, Modal, Row, Skeleton, Statistic, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { DashboardStats } from '../api/types';
import { PageHeader } from '../components/PageHeader';
import { StatClickCard } from '../components/StatClickCard';
import { fetchDashboard } from '../services/adminApi';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [visitsModalOpen, setVisitsModalOpen] = useState(false);

  const load = () => {
    setLoading(true);
    fetchDashboard()
      .then(setStats)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading || !stats) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  const auditTotal =
    stats.pendingCompanyAudit + stats.pendingPublishAudit + stats.pendingCommunityAudit;

  const auditBreakdown = [
    { key: 'company', label: '展厅入驻', count: stats.pendingCompanyAudit, path: '/audit/company?status=pending' },
    { key: 'publish', label: '会员发布', count: stats.pendingPublishAudit, path: '/audit/publish?status=pending' },
    { key: 'community', label: '社区帖子', count: stats.pendingCommunityAudit, path: '/audit/community?status=pending' },
  ];

  const visitBreakdown = [
    { source: '首页', pv: 512, uv: 386 },
    { source: '找工厂', pv: 298, uv: 201 },
    { source: '宠业社区', pv: 244, uv: 178 },
    { source: '宠业展厅', pv: 186, uv: 132 },
    { source: '发布/我的发布', pv: 156, uv: 112 },
    { source: '其他', pv: 74, uv: 58 },
  ];

  const quickLinks = [
    { label: '展厅入驻审核', path: '/audit/company', count: stats.pendingCompanyAudit },
    { label: '会员发布管理', path: '/audit/publish', count: stats.pendingPublishAudit },
    { label: '社区帖子审核', path: '/audit/community', count: stats.pendingCommunityAudit },
    { label: '小程序用户', path: '/users', count: stats.totalUsers },
    { label: '付费会员', path: '/members/paid', count: stats.activeMembers },
    { label: '付费订单', path: '/members/orders', count: stats.pendingMemberOrders },
    { label: '收款管理', path: '/finance/receipts', count: stats.pendingReceipts },
  ];

  return (
    <div>
      <PageHeader
        title="工作台"
        description="统计卡片可点击查看明细或进入对应列表；Mock 模式下为演示数据。"
        extra={
          <Button onClick={load} loading={loading}>
            刷新数据
          </Button>
        }
      />

      {auditTotal > 0 && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 20 }}
          title={`当前有 ${auditTotal} 条待审核事项`}
          action={
            <Button size="small" type="primary" onClick={() => setAuditModalOpen(true)}>
              查看明细
            </Button>
          }
        />
      )}

      {stats.pendingReceipts > 0 && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
          title={`有 ${stats.pendingReceipts} 笔收款待财务确认（含对公转账）`}
          action={
            <Link to="/finance/receipts?status=pending">
              <Button size="small" type="primary">
                去确认
              </Button>
            </Link>
          }
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatClickCard className="stat-card-warn" onClick={() => setAuditModalOpen(true)}>
            <Statistic title="待处理审核" value={auditTotal} prefix={<AuditOutlined />} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              点击查看分项
            </Typography.Text>
          </StatClickCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatClickCard className="stat-card-primary" to="/users">
            <Statistic title="小程序用户" value={stats.totalUsers} prefix={<UserOutlined />} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              点击进入用户列表
            </Typography.Text>
          </StatClickCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatClickCard className="stat-card-success" to="/members/paid">
            <Statistic title="有效会员" value={stats.activeMembers} prefix={<TeamOutlined />} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              点击查看付费会员
            </Typography.Text>
          </StatClickCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatClickCard className="stat-card-neutral" onClick={() => setVisitsModalOpen(true)}>
            <Statistic title="今日访问（预估）" value={stats.todayVisits} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              点击查看来源分布
            </Typography.Text>
          </StatClickCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatClickCard className="stat-card-warn" to="/finance/receipts?status=pending">
            <Statistic title="待确认收款" value={stats.pendingReceipts} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              点击进入待确认列表
            </Typography.Text>
          </StatClickCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatClickCard className="stat-card-success" to="/finance/receipts?status=confirmed">
            <Statistic
              title="本月已确认收款（元）"
              value={stats.monthReceiptAmount}
              precision={0}
            />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              点击查看已收款记录
            </Typography.Text>
          </StatClickCard>
        </Col>
      </Row>

      <Modal
        title="待审核明细"
        open={auditModalOpen}
        onCancel={() => setAuditModalOpen(false)}
        footer={null}
        width={520}
      >
        <Table
          size="small"
          pagination={false}
          rowKey="key"
          dataSource={auditBreakdown}
          columns={[
            { title: '模块', dataIndex: 'label' },
            { title: '待处理', dataIndex: 'count', width: 90 },
            {
              title: '操作',
              width: 120,
              render: (_, row) => (
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    setAuditModalOpen(false);
                    navigate(row.path);
                  }}
                >
                  查看列表
                </Button>
              ),
            },
          ]}
        />
      </Modal>

      <Modal
        title="今日访问来源（预估）"
        open={visitsModalOpen}
        onCancel={() => setVisitsModalOpen(false)}
        footer={null}
        width={480}
      >
        <Table
          size="small"
          pagination={false}
          rowKey="source"
          dataSource={visitBreakdown}
          columns={[
            { title: '来源', dataIndex: 'source' },
            { title: 'PV', dataIndex: 'pv', width: 80 },
            { title: 'UV', dataIndex: 'uv', width: 80 },
          ]}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <strong>合计</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong>{stats.todayVisits}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>—</Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
        <Typography.Paragraph type="secondary" style={{ marginTop: 12, marginBottom: 0, fontSize: 12 }}>
          接入小程序数据分析或云统计后，此处将展示实时数据。
        </Typography.Paragraph>
      </Modal>

      <Typography.Title level={5} style={{ marginTop: 28, marginBottom: 12 }}>
        快捷入口
      </Typography.Title>
      <Row gutter={[12, 12]} style={{ marginBottom: 28 }}>
        {quickLinks.map((item) => (
          <Col xs={24} sm={12} lg={6} key={item.path}>
            <Link to={item.path} className="quick-link-card">
              <span>{item.label}</span>
              <span className="quick-link-meta">
                {item.count}
                <ArrowRightOutlined />
              </span>
            </Link>
          </Col>
        ))}
      </Row>

      <Typography.Title level={5} style={{ marginBottom: 12 }}>
        内容概览
      </Typography.Title>
      <Row gutter={[16, 16]}>
        {(
          [
            ['找工厂', stats.contentCounts.factories, '/content/factories'],
            ['找订单', stats.contentCounts.orders, '/content/orders'],
            ['门店货源', stats.contentCounts.storeSupply, '/content/store-supply'],
            ['门店求购', stats.contentCounts.storeDemands, '/content/store-demands'],
            ['创投项目', stats.contentCounts.projects, '/content/invest'],
            ['达人', stats.contentCounts.influencers, '/content/influencers'],
            ['宠业展厅', stats.contentCounts.directory, '/content/directory'],
            ['产业园/商协会', stats.contentCounts.industryOrgs, '/content/industry'],
            ['社区帖子', stats.contentCounts.communityPosts, '/audit/community'],
          ] as const
        ).map(([label, value, path]) => (
          <Col xs={12} sm={8} lg={6} key={path}>
            <StatClickCard
              className="content-stat-card content-stat-card-clickable"
              to={path}
            >
              <Statistic
                title={label}
                value={value}
                prefix={<FileOutlined style={{ fontSize: 16, opacity: 0.65 }} />}
              />
              <span className="content-stat-link">
                查看数据 <ArrowRightOutlined />
              </span>
            </StatClickCard>
          </Col>
        ))}
      </Row>
    </div>
  );
}
