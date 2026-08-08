// src/components/dashboard/CambiarPasswordForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { App, Button, Form, Input } from 'antd';
import { cambiarPassword } from '@/lib/api/auth';
import { useAuth } from '@/hooks/useAuth';

interface FormValues {
  actual: string;
  nueva: string;
  confirmar: string;
}

export function CambiarPasswordForm() {
  const router = useRouter();
  const { message } = App.useApp();
  const { updateUser } = useAuth();
  const [guardando, setGuardando] = useState(false);

  async function handleFinish(values: FormValues) {
    if (values.nueva !== values.confirmar) {
      message.error('Las contraseñas no coinciden');
      return;
    }
    setGuardando(true);
    try {
      await cambiarPassword({ actual: values.actual, nueva: values.nueva });
      updateUser({ mustChangePassword: false });
      message.success('Contraseña actualizada');
      router.push('/panel');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 48 }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 32,
          border: '1px solid var(--color-sidebar-border)',
          maxWidth: 460,
          width: '100%',
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Cambia tu contraseña</h1>
        <p style={{ color: '#666', marginBottom: 24 }}>
          Es tu primer ingreso con una contraseña temporal. Debes reemplazarla antes de continuar.
        </p>

        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="actual"
            label="Contraseña temporal"
            rules={[{ required: true, message: 'Ingresa la contraseña temporal que te dieron' }]}
          >
            <Input.Password placeholder="Contraseña temporal" />
          </Form.Item>
          <Form.Item
            name="nueva"
            label="Nueva contraseña"
            rules={[{ required: true, min: 8, message: 'Mínimo 8 caracteres' }]}
          >
            <Input.Password placeholder="Nueva contraseña" />
          </Form.Item>
          <Form.Item
            name="confirmar"
            label="Confirmar contraseña"
            rules={[{ required: true, message: 'Confirma la nueva contraseña' }]}
          >
            <Input.Password placeholder="Confirmar contraseña" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={guardando} block>
            Actualizar contraseña
          </Button>
        </Form>
      </div>
    </div>
  );
}
