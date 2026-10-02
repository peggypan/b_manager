import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import LoginPage from '../pages/Login';
import DashboardPage from '../pages/Dashboard';
import CompanyAuditPage from '../pages/audit/CompanyAudit';
import PublishAuditPage from '../pages/audit/PublishAudit';
import CommunityAuditPage from '../pages/audit/CommunityAudit';
import UsersPage from '../pages/UsersPage';
import ReceiptPage from '../pages/finance/ReceiptPage';
import {
  MemberOrdersPage,
  MemberPlansPage,
  PaidMembersPage,
} from '../pages/members/MemberPages';
import {
  BannersPage,
  DirectoryPage,
  FactoriesPage,
  IndustryPage,
  InfluencersPage,
  InvestPage,
  MediaServicesPage,
  OrdersPage,
  StoreDemandsPage,
  StoreSupplyPage,
} from '../pages/content/ContentPages';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

function RequireAuth({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="audit/company" element={<CompanyAuditPage />} />
        <Route path="audit/publish" element={<PublishAuditPage />} />
        <Route path="audit/community" element={<CommunityAuditPage />} />
        <Route path="content/factories" element={<FactoriesPage />} />
        <Route path="content/orders" element={<OrdersPage />} />
        <Route path="content/store-supply" element={<StoreSupplyPage />} />
        <Route path="content/store-demands" element={<StoreDemandsPage />} />
        <Route path="content/invest" element={<InvestPage />} />
        <Route path="content/influencers" element={<InfluencersPage />} />
        <Route path="content/directory" element={<DirectoryPage />} />
        <Route path="content/industry" element={<IndustryPage />} />
        <Route path="content/banners" element={<BannersPage />} />
        <Route path="content/media" element={<MediaServicesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="members/paid" element={<PaidMembersPage />} />
        <Route path="members/plans" element={<MemberPlansPage />} />
        <Route path="members/orders" element={<MemberOrdersPage />} />
        <Route path="finance/receipts" element={<ReceiptPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
