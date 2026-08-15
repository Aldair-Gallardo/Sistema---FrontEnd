// src/components/cliente/PerfilForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { App, Avatar, Button, Form, Input, Spin, Switch } from 'antd';
import { actualizarPerfil, cambiarPassword, obtenerPerfil } from '@/lib/api/cliente';
import { useAuth } from '@/hooks/useAuth';
import type { UsuarioCliente } from '@/types/cliente';

export function PerfilForm() {
  const { message } = App.useApp();
  const [infoForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const { updateUser } = useAuth();

  const [usuario, setUsuario] = useState<UsuarioCliente | null>(null);
  const [guardandoInfo, setGuardandoInfo] = useState(false);
  const [guardandoPassword, setGuardandoPassword] = useState(false);

  const [pedidosNotif, setPedidosNotif] = useState(true);
  const [disponibilidadNotif, setDisponibilidadNotif] = useState(true);
  const [ofertasNotif, setOfertasNotif] = useState(true);

  useEffect(() => {
    obtenerPerfil()
      .then(setUsuario)
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudo cargar tu perfil'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recién aquí el <Form> ya está montado (el early return de abajo lo oculta
  // mientras `usuario` es null), así que es seguro llamar setFieldsValue.
  useEffect(() => {
    if (!usuario) return;
    infoForm.setFieldsValue({ nombre: usuario.nombre, telefono: usuario.telefono, correo: usuario.correo });
    
    // Cargar preferencias de notificaciones desde localStorage
    const savedPrefs = localStorage.getItem(`teca_notif_prefs_${usuario.correo}`);
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        setPedidosNotif(parsed.pedidos ?? true);
        setDisponibilidadNotif(parsed.disponibilidad ?? true);
        setOfertasNotif(parsed.ofertas ?? true);
      } catch (e) {
        console.error("Error al parsear preferencias de notificaciones:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  function savePrefs(key: 'pedidos' | 'disponibilidad' | 'ofertas', value: boolean) {
    if (!usuario) return;
    
    const currentPrefs = {
      pedidos: key === 'pedidos' ? value : pedidosNotif,
      disponibilidad: key === 'disponibilidad' ? value : disponibilidadNotif,
      ofertas: key === 'ofertas' ? value : ofertasNotif,
    };
    
    localStorage.setItem(`teca_notif_prefs_${usuario.correo}`, JSON.stringify(currentPrefs));
    
    if (key === 'pedidos') setPedidosNotif(value);
    if (key === 'disponibilidad') setDisponibilidadNotif(value);
    if (key === 'ofertas') setOfertasNotif(value);

    message.success('Preferencias actualizadas');
  }

  async function handleGuardarInfo(values: { nombre: string; telefono?: string }) {
    setGuardandoInfo(true);
    try {
      const actualizado = await actualizarPerfil({ nombre: values.nombre, telefono: values.telefono });
      setUsuario(actualizado);
      updateUser({ name: actualizado.nombre });
      message.success('Cambios guardados');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    } finally {
      setGuardandoInfo(false);
    }
  }

  async function handleActualizarPassword(values: { actual: string; nueva: string; confirmar: string }) {
    if (values.nueva !== values.confirmar) {
      message.error('Las contraseñas no coinciden');
      return;
    }
    setGuardandoPassword(true);
    try {
      await cambiarPassword({ actual: values.actual, nueva: values.nueva });
      message.success('Contraseña actualizada');
      passwordForm.resetFields();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    } finally {
      setGuardandoPassword(false);
    }
  }

  if (!usuario) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin />
      </div>
    );
  }

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
        <Form form={infoForm} layout="vertical" onFinish={handleGuardarInfo}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Form.Item
              name="nombre"
              label="Nombre completo"
              style={{ flex: 1, minWidth: 220 }}
              rules={[{ required: true, message: 'Ingresa tu nombre' }]}
            >
              <Input placeholder="Nombre completo" />
            </Form.Item>
            <Form.Item name="telefono" label="Teléfono" style={{ flex: 1, minWidth: 220 }}>
              <Input placeholder="Teléfono" />
            </Form.Item>
          </div>
          <Form.Item name="correo" label="Correo electrónico" style={{ maxWidth: 460 }}>
            <Input placeholder="Correo electrónico" disabled title="El correo no se puede cambiar" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={guardandoInfo}>
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
          <Form.Item
            name="actual"
            label="Contraseña actual"
            style={{ maxWidth: 460 }}
            rules={[{ required: true, message: 'Ingresa tu contraseña actual' }]}
          >
            <Input.Password placeholder="Contraseña actual" />
          </Form.Item>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Form.Item
              name="nueva"
              label="Nueva contraseña"
              style={{ flex: 1, minWidth: 220 }}
              rules={[{ required: true, min: 8, message: 'Mínimo 8 caracteres' }]}
            >
              <Input.Password placeholder="Nueva contraseña" />
            </Form.Item>
            <Form.Item
              name="confirmar"
              label="Confirmar contraseña"
              style={{ flex: 1, minWidth: 220 }}
              rules={[{ required: true, message: 'Confirma la nueva contraseña' }]}
            >
              <Input.Password placeholder="Confirmar contraseña" />
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" loading={guardandoPassword}>
            Actualizar contraseña
          </Button>
        </Form>
      </div>

      {/* Preferencias de notificaciones */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          border: '1px solid var(--color-sidebar-border)',
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Preferencias de notificaciones</h2>
        <p style={{ color: '#666', fontSize: 13, marginBottom: 20 }}>
          Elige qué tipo de notificaciones deseas recibir. Las notificaciones críticas de transacciones y seguridad no se pueden desactivar.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Actualizaciones de pedido */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Actualizaciones de pedido</h4>
              <p style={{ color: '#8c8c8c', fontSize: 12, margin: '2px 0 0 0' }}>
                Recibe correos con el estado de preparación y envío de tus compras.
              </p>
            </div>
            <Switch checked={pedidosNotif} onChange={(val) => savePrefs('pedidos', val)} />
          </div>

          <hr style={{ border: 0, borderTop: '1px solid #f0f0f0', margin: 0 }} />

          {/* Disponibilidad de producto */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Disponibilidad de producto</h4>
              <p style={{ color: '#8c8c8c', fontSize: 12, margin: '2px 0 0 0' }}>
                Te avisamos cuando los productos que te interesan vuelvan a estar disponibles.
              </p>
            </div>
            <Switch checked={disponibilidadNotif} onChange={(val) => savePrefs('disponibilidad', val)} />
          </div>

          <hr style={{ border: 0, borderTop: '1px solid #f0f0f0', margin: 0 }} />

          {/* Promociones y ofertas */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Promociones y ofertas</h4>
              <p style={{ color: '#8c8c8c', fontSize: 12, margin: '2px 0 0 0' }}>
                Recibe correos con ofertas exclusivas, cupones de descuento y novedades.
              </p>
            </div>
            <Switch checked={ofertasNotif} onChange={(val) => savePrefs('ofertas', val)} />
          </div>

          <hr style={{ border: 0, borderTop: '1px solid #f0f0f0', margin: 0 }} />

          {/* Transaccionales críticas */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, opacity: 0.7 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#595959' }}>Transaccionales críticas</h4>
              <p style={{ color: '#8c8c8c', fontSize: 12, margin: '2px 0 0 0' }}>
                Confirmaciones de compra, facturas y recuperación de contraseña. Obligatorio por seguridad.
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
