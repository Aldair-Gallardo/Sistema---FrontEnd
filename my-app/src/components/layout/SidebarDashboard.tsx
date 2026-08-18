'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UndoOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  FileSearchOutlined,
  LogoutOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { canAccessRoute } from '@/lib/roles';

import './SidebarDashboard.css';

const { Sider } = Layout;

const MENU_ITEMS_BASE = [
  { key: 'panel', ruta: '/panel', icon: <DashboardOutlined />, texto: 'Panel' },
  { key: 'usuarios', ruta: '/usuarios', icon: <UserOutlined />, texto: 'Usuarios' },
  { key: 'productos', ruta: '/productos', icon: <ShoppingOutlined />, texto: 'Productos' },
  { key: 'pedidos', ruta: '/pedidos', icon: <ShoppingCartOutlined />, texto: 'Pedidos' },
  { key: 'devoluciones-admin', ruta: '/devoluciones-admin', icon: <UndoOutlined />, texto: 'Devoluciones' },
  { key: 'finanzas', ruta: '/finanzas', icon: <DollarOutlined />, texto: 'Finanzas' },
  { key: 'permisos', ruta: '/permisos', icon: <SafetyCertificateOutlined />, texto: 'Permisos' },
  { key: 'auditoria', ruta: '/auditoria', icon: <FileSearchOutlined />, texto: 'Auditoría' },
];

export default function SidebarDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  // El menú siempre se ve completo; las opciones sin acceso para el rol
  // actual muestran un candado a la derecha, pero siguen siendo clicables —
  // el proxy (src/proxy.ts) es quien realmente bloquea y manda a
  // /acceso-denegado si el rol no tiene permiso para esa sección.
  const menuItems = MENU_ITEMS_BASE.map(({ key, ruta, icon, texto }) => {
    const tieneAcceso = canAccessRoute(ruta, user?.role);
    return {
      key,
      icon,
      label: (
        <Link href={ruta} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{texto}</span>
          {!tieneAcceso && <LockOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />}
        </Link>
      ),
    };
  });

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      style={{
        height: '100%',
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
          flexShrink: 0,
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
          flex: 1,
          minHeight: 0,
          background: 'var(--color-sidebar)',
        }}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={['panel']}
          className="dashboard-menu"
          items={menuItems}
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