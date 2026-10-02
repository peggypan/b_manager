import type { ThemeConfig } from 'antd';

/** 与小程序导航栏 #1A56DB 保持一致 */
export const antTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1A56DB',
    borderRadius: 8,
    fontFamily:
      '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Layout: {
      siderBg: '#0f172a',
      triggerBg: '#1e293b',
    },
    Menu: {
      darkItemBg: '#0f172a',
      darkSubMenuItemBg: '#0b1220',
    },
    Table: {
      headerBg: '#f8fafc',
      headerColor: '#475569',
    },
  },
};
