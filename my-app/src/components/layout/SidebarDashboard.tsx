'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';

import './SidebarDashboard.css';

const { Sider } = Layout;

export default function SidebarDashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      style={{
        minHeight: '100vh',
        background: 'var(--color-sidebar)',
        borderRight: '1px solid var(--color-sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Botón para expandir/contraer */}
      <div
        style={{
          height: 64,
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-end',
          alignItems: 'center',
          padding: '0 16px',
          borderBottom: '1px solid var(--color-sidebar-border)',
          background: 'var(--color-sidebar)',
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            color: '#000',
            fontSize: 18,
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 'calc(100vh - 64px)',
          background: 'var(--color-sidebar)',
        }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={['panel']}
          className="dashboard-menu"
          items={[
            {
              key: 'panel',
              icon: <DashboardOutlined />,
              label: <Link href="/panel">Panel</Link>,
            },
            {
              key: 'usuarios',
              icon: <UserOutlined />,
              label: <Link href="/usuarios">Usuarios</Link>,
            },
            {
              key: 'productos',
              icon: <ShoppingOutlined />,
              label: <Link href="/productos">Productos</Link>,
            },
            {
              key: 'finanzas',
              icon: <DollarOutlined />,
              label: <Link href="/finanzas">Finanzas</Link>,
            },
            {
              key: 'permisos',
              icon: <SafetyCertificateOutlined />,
              label: <Link href="/permisos">Permisos</Link>,
            },
          ]}
        />

        <Menu
          mode="inline"
          selectable={false}
          className="dashboard-menu logout-menu"
          items={[
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: <Link href="/logout">Cerrar sesión</Link>,
            },
          ]}
        />
      </div>
    </Sider>
  );
}