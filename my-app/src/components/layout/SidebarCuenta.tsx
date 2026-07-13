'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  CreditCardOutlined,
  UndoOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';

import './SidebarDashboard.css';

const { Sider } = Layout;

export default function SidebarCuenta() {
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
          defaultSelectedKeys={['mi-cuenta']}
          className="dashboard-menu"
          items={[
            {
              key: 'mi-cuenta',
              icon: <UserOutlined />,
              label: <Link href="/mi-cuenta">Mi cuenta</Link>,
            },
            {
              key: 'mis-pedidos',
              icon: <ShoppingCartOutlined />,
              label: <Link href="/mis-pedidos">Mis pedidos</Link>,
            },
            {
              key: 'direcciones',
              icon: <HomeOutlined />,
              label: <Link href="/direcciones">Direcciones</Link>,
            },
            {
              key: 'metodos-de-pago',
              icon: <CreditCardOutlined />,
              label: (
                <Link href="/metodos-de-pago">
                  Métodos de pago
                </Link>
              ),
            },
            {
              key: 'devoluciones',
              icon: <UndoOutlined />,
              label: <Link href="/devoluciones">Devoluciones</Link>,
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