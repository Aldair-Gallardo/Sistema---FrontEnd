// src/lib/AntdRegistry.tsx
'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { colors } from '@/lib/theme';

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colors.header,       // el café como color principal
            colorText: colors.textDark,
            colorBgLayout: colors.background,
            borderRadius: 8,
          },
          components: {
            Layout: {
              headerBg: colors.header,          // fondo del header = café
              headerColor: colors.textLight,    // texto del header = blanco
            },
            Menu: {
              itemColor: colors.textLight,           // texto del menú = blanco
              itemHoverColor: colors.textLight,
              horizontalItemSelectedColor: colors.textLight,
              colorBgContainer: 'transparent',       // que el menú no tenga su propio fondo
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}