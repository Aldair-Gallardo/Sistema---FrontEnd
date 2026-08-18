// src/components/dashboard/UsuarioInternoForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { App, Button, Checkbox, Empty, Form, Input, Select, Spin, Tag } from 'antd';
import {
  actualizarUsuarioInterno,
  crearUsuarioInterno,
  listarRolesPermisos,
  obtenerUsuarioInterno,
  type RolPermisos,
} from '@/lib/api/usuariosInternos';
import { ROLE_LABELS, STAFF_ROLES } from '@/lib/roles';
import type { RolInterno } from '@/types/usuarioInterno';

interface FormValues {
  nombre: string;
  correo: string;
  telefono?: string;
  descripcion?: string;
  rol: RolInterno;
  passwordTemporal?: string;
  debeCambiarPassword?: boolean;
  activo?: boolean;
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  border: '1px solid var(--color-sidebar-border)',
};

export function UsuarioInternoForm({ usuarioId }: { usuarioId?: string }) {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const rolElegido = Form.useWatch('rol', form);

  const [cargando, setCargando] = useState(!!usuarioId);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [estadoActual, setEstadoActual] = useState<boolean | null>(null);
  const [roles, setRoles] = useState<RolPermisos[] | null>(null);

  useEffect(() => {
    listarRolesPermisos()
      .then(setRoles)
      .catch(() => setRoles([]));
  }, []);

  useEffect(() => {
    if (!usuarioId) return;
    obtenerUsuarioInterno(usuarioId)
      .then((usuario) => {
        if (!usuario) {
          setNoEncontrado(true);
          return;
        }
        form.setFieldsValue({
          nombre: usuario.nombre,
          correo: usuario.correo,
          telefono: usuario.telefono,
          descripcion: usuario.descripcion,
          rol: usuario.rol,
        });
        setEstadoActual(usuario.activo);
      })
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudo cargar el usuario'))
      .finally(() => setCargando(false));
  }, [usuarioId, form, message]);

  async function handleSubmit(values: FormValues) {
    setGuardando(true);
    try {
      if (usuarioId) {
        await actualizarUsuarioInterno(usuarioId, {
          nombre: values.nombre,
          correo: values.correo,
          telefono: values.telefono,
          descripcion: values.descripcion,
          rol: values.rol,
        });
        message.success('Usuario actualizado');
      } else {
        await crearUsuarioInterno({
          nombre: values.nombre,
          correo: values.correo,
          telefono: values.telefono,
          descripcion: values.descripcion,
          rol: values.rol,
          passwordTemporal: values.passwordTemporal ?? '',
          debeCambiarPassword: !!values.debeCambiarPassword,
          activo: values.activo ?? true,
        });
        message.success('Usuario creado');
      }
      router.push('/usuarios');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    } finally {
      setGuardando(false);
    }
  }

  if (noEncontrado) {
    return (
      <div style={{ ...cardStyle, padding: 48 }}>
        <Empty description="No encontramos este usuario" />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href="/usuarios">
            <Button>Volver a usuarios</Button>
          </Link>
        </div>
      </div>
    );
  }

  const permisosDelRol = roles?.find((r) => r.rol === rolElegido)?.permisos;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          {usuarioId ? 'Editar usuario interno' : 'Nuevo usuario interno'}
        </h1>
        <Link href="/usuarios">
          <Button shape="round">Volver</Button>
        </Link>
      </div>

      <Spin spinning={cargando} style={cardStyle}>
        {usuarioId && estadoActual !== null && (
          <div style={{ marginBottom: 16 }}>
            Estado actual: {estadoActual ? <Tag color="green">Activo</Tag> : <Tag>Inactivo</Tag>}
            <span style={{ color: '#8c8c8c', marginLeft: 8, fontSize: 13 }}>
              (se cambia desde Eliminar/Reactivar en la tabla, no aquí)
            </span>
          </div>
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ debeCambiarPassword: true, activo: true }}>
          <Form.Item name="nombre" label="Nombre completo" rules={[{ required: true, message: 'Ingresa el nombre' }]}>
            <Input placeholder="Nombre y apellido" />
          </Form.Item>
          <Form.Item
            name="correo"
            label="Correo electrónico"
            rules={[{ required: true, type: 'email', message: 'Ingresa un correo válido' }]}
          >
            <Input placeholder="usuario@teca.com" />
          </Form.Item>
          <Form.Item name="telefono" label="Teléfono">
            <Input placeholder="6000-0000" />
          </Form.Item>
          <Form.Item name="descripcion" label="Descripción">
            <Input.TextArea rows={2} placeholder="Nota interna, ej. «Encargado de inventario»" />
          </Form.Item>

          <Form.Item name="rol" label="Rol asignado" rules={[{ required: true, message: 'Selecciona un rol' }]}>
            <Select
              placeholder="Selecciona un rol"
              options={STAFF_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
            />
          </Form.Item>

          {rolElegido && (
            <div style={{ marginBottom: 24, marginTop: -12 }}>
              <span style={{ color: '#8c8c8c', fontSize: 13 }}>Accesos de este rol: </span>
              {permisosDelRol === undefined ? (
                <span style={{ color: '#8c8c8c', fontSize: 13 }}>cargando...</span>
              ) : permisosDelRol.length === 0 ? (
                <span style={{ color: '#8c8c8c', fontSize: 13 }}>sin accesos configurados</span>
              ) : (
                permisosDelRol.map((permiso) => (
                  <Tag key={permiso} style={{ marginBottom: 4 }}>
                    {permiso}
                  </Tag>
                ))
              )}
            </div>
          )}

          {!usuarioId && (
            <>
              <Form.Item
                name="passwordTemporal"
                label="Contraseña temporal"
                rules={[{ required: true, min: 8, message: 'Mínimo 8 caracteres' }]}
              >
                <Input.Password placeholder="Mínimo 8 caracteres" />
              </Form.Item>
              <Form.Item name="debeCambiarPassword" valuePropName="checked">
                <Checkbox>El usuario deberá cambiarla en su primer ingreso</Checkbox>
              </Form.Item>
              <Form.Item name="activo" valuePropName="checked">
                <Checkbox>Usuario activo — puede iniciar sesión inmediatamente</Checkbox>
              </Form.Item>
            </>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <Button type="primary" htmlType="submit" loading={guardando}>
              {usuarioId ? 'Guardar cambios' : 'Registrar usuario'}
            </Button>
            <Link href="/usuarios">
              <Button>Cancelar</Button>
            </Link>
          </div>
        </Form>
      </Spin>
    </div>
  );
}
