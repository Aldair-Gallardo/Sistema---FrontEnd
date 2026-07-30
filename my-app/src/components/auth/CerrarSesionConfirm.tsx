// src/components/auth/CerrarSesionConfirm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button, message } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

export function CerrarSesionConfirm({ cancelarHref = '/' }: { cancelarHref?: string }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleCerrarSesion = () => {
    logout();
    message.success('Sesión cerrada exitosamente');
    router.push('/');
  };

  const handleCancelar = () => {
    router.push(cancelarHref);
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Cerrar sesión</h1>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '56px 24px',
            border: '1px solid var(--color-sidebar-border)',
            maxWidth: 480,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <LogoutOutlined style={{ fontSize: 48, color: 'var(--color-header)', marginBottom: 8 }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>¿Seguro que quieres salir?</h2>
          <p style={{ color: '#666', textAlign: 'center', margin: 0 }}>
            Tu sesión se cerrará en este dispositivo.
            <br />
            Puedes volver a ingresar en cualquier momento.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', marginTop: 24 }}>
            <Button type="primary" block onClick={handleCerrarSesion}>
              Cerrar sesión
            </Button>
            <Button block onClick={handleCancelar}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
