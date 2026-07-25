// src/components/cliente/PerfilForm.tsx
'use client';

import { Avatar, Button, Form, Input, message } from 'antd';
import type { UsuarioCliente } from '@/types/cliente';

export function PerfilForm({ usuario }: { usuario: UsuarioCliente }) {
  const [infoForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Sin backend conectado todavía: por ahora solo confirmamos visualmente el envío.
  const handleGuardarInfo = () => {
    message.success('Cambios guardados (simulado, aún sin backend)');
  };

  const handleActualizarPassword = () => {
    message.success('Contraseña actualizada (simulado, aún sin backend)');
    passwordForm.resetFields();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Mi cuenta</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Avatar size={64} style={{ background: 'var(--color-header)', fontSize: 22, fontWeight: 700 }}>
          {usuario.iniciales}
        </Avatar>
        <div>
          <p style={{ fontWeight: 700, fontSize: 17, margin: 0 }}>{usuario.nombre}</p>
          <p style={{ color: '#666', margin: 0 }}>{usuario.correo}</p>
          <p style={{ color: '#8c8c8c', fontSize: 12, margin: 0 }}>{usuario.rol}</p>
        </div>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          border: '1px solid var(--color-sidebar-border)',
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Información personal</h2>
        <Form
          form={infoForm}
          layout="vertical"
          onFinish={handleGuardarInfo}
          initialValues={{
            nombre: usuario.nombre,
            telefono: usuario.telefono,
            correo: usuario.correo,
          }}
        >
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Form.Item name="nombre" label="Nombre completo" style={{ flex: 1, minWidth: 220 }}>
              <Input placeholder="Nombre completo" />
            </Form.Item>
            <Form.Item name="telefono" label="Teléfono" style={{ flex: 1, minWidth: 220 }}>
              <Input placeholder="Teléfono" />
            </Form.Item>
          </div>
          <Form.Item name="correo" label="Correo electrónico" style={{ maxWidth: 460 }}>
            <Input placeholder="Correo electrónico" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar cambios
          </Button>
        </Form>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          border: '1px solid var(--color-sidebar-border)',
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Cambiar contraseña</h2>
        <Form form={passwordForm} layout="vertical" onFinish={handleActualizarPassword}>
          <Form.Item name="actual" label="Contraseña actual" style={{ maxWidth: 460 }}>
            <Input.Password placeholder="Contraseña actual" />
          </Form.Item>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Form.Item name="nueva" label="Nueva contraseña" style={{ flex: 1, minWidth: 220 }}>
              <Input.Password placeholder="Nueva contraseña" />
            </Form.Item>
            <Form.Item name="confirmar" label="Confirmar contraseña" style={{ flex: 1, minWidth: 220 }}>
              <Input.Password placeholder="Confirmar contraseña" />
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit">
            Actualizar contraseña
          </Button>
        </Form>
      </div>
    </div>
  );
}
