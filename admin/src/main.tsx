import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { BrowserRouter } from 'react-router-dom';
import { registerMockRouter } from './api/client';
import { mockCloudRouter } from './mock/router';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './router';
import { antTheme } from './theme/antTheme';
import './styles/global.css';

dayjs.locale('zh-cn');

registerMockRouter(mockCloudRouter);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN} theme={antTheme}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
);
