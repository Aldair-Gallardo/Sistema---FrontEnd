// src/components/dashboard/UsersTable.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { App, Button, Input, Select, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { desactivarUsuarioInterno, listarUsuariosInternos, reactivarUsuarioInterno } from '@/lib/api/usuariosInternos';
import type { UsuarioInterno } from '@/types/usuarioInterno';
import { ROLE_LABELS, STAFF_ROLES, type Role } from '@/lib/roles';
import { useAuth } from '@/hooks/useAuth';

export function UsersTable() {
  const { message, modal } = App.useApp();
  const { user } = useAuth();

  const [usuarios, setUsuarios] = useState<UsuarioInterno[] | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [rol, setRol] = useState<Role | undefined>();

  function cargar() {
    listarUsuariosInternos()
      .then(setUsuarios)
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudieron cargar los usuarios'));
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tabla principal: todos los usuarios internos, activos e inactivos juntos
  // (el Estado de cada fila los distingue). Nunca clientes: el backend ya los excluye.
  const filtrados = useMemo(() => {
    if (!usuarios) return [];
    const texto = busqueda.trim().toLowerCase();
    return usuarios.filter((u) => {
      if (rol && u.rol !== rol) return false;
      if (texto && !u.nombre.toLowerCase().includes(texto) && !u.correo.toLowerCase().includes(texto)) return false;
      return true;
    });
  }, [usuarios, busqueda, rol]);

  function handleEliminar(usuario: UsuarioInterno) {
    modal.confirm({
      title: '¿Eliminar este usuario?',
      content: 'El usuario pasará a estado inactivo y no podrá iniciar sesión. Sus datos no se borran de la base de datos.',
      okText: 'Eliminar',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await desactivarUsuarioInterno(usuario.id);
          message.success('Usuario eliminado');
          cargar();
        } catch (error) {
          message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
        }
      },
    });
  }

  function handleReactivar(usuario: UsuarioInterno) {
    modal.confirm({
      title: '¿Reactivar este usuario?',
      content: 'Podrá volver a iniciar sesión.',
      okText: 'Reactivar',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await reactivarUsuarioInterno(usuario.id);
          message.success('Usuario reactivado');
          cargar();
        } catch (error) {
          message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
        }
      },
    });
  }

  const columns: ColumnsType<UsuarioInterno> = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (nombre: string, usuario) => (
        <b>
          {nombre}
          {usuario.id === user?.id ? ' (Tú)' : ''}
        </b>
      ),
    },
    { title: 'Correo', dataIndex: 'correo', key: 'correo' },
    { title: 'Rol', dataIndex: 'rol', key: 'rol', render: (rolFila: Role) => ROLE_LABELS[rolFila] },
    {
      // Solo informativo: el estado no se edita acá, se cambia con Eliminar/Reactivar.
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      render: (activo: boolean) => (activo ? <Tag color="green">Activo</Tag> : <Tag>Inactivo</Tag>),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: unknown, usuario: UsuarioInterno) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/usuarios/${usuario.id}`}>
            <Button size="small" icon={<EditOutlined />} />
          </Link>
          {usuario.id === user?.id ? null : usuario.activo ? (
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleEliminar(usuario)} />
          ) : (
            <Button size="small" onClick={() => handleReactivar(usuario)}>
              Reactivar
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        border: '1px solid var(--color-sidebar-border)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Usuarios</h1>
        <Link href="/usuarios/nuevo">
          <Button type="primary" icon={<PlusOutlined />}>
            Nuevo
          </Button>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar por nombre o correo..."
          allowClear
          style={{ flex: 1, minWidth: 220 }}
          onSearch={setBusqueda}
        />
        <Select
          placeholder="Rol"
          allowClear
          style={{ minWidth: 180 }}
          value={rol}
          onChange={setRol}
          options={STAFF_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
        />
      </div>

      <Table
        rowKey="id"
        loading={!usuarios}
        columns={columns}
        dataSource={filtrados}
        pagination={{
          pageSize: 10,
          showTotal: (totalItems, rango) => `Mostrando ${rango[1]} de ${totalItems} usuarios`,
        }}
      />
    </div>
  );
}
