// src/components/cliente/DireccionesList.tsx
'use client';

import { useEffect, useState } from 'react';
import { App, Button, Checkbox, Form, Input, Modal, Spin, Tag } from 'antd';
import { CheckCircleFilled, PlusOutlined } from '@ant-design/icons';
import { actualizarDireccion, crearDireccion, eliminarDireccion, listarDirecciones } from '@/lib/api/direcciones';
import type { Direccion, DireccionInput } from '@/types/cliente';

interface DireccionesListProps {
  /** true = modo "elige una dirección" (checkout): tarjetas clicables, sin Editar/Eliminar. */
  modoSeleccion?: boolean;
  direccionSeleccionadaId?: string;
  onSeleccionar?: (direccion: Direccion) => void;
  /** Se dispara una vez cuando termina de cargar la lista (para que el checkout preseleccione la principal). */
  onCargar?: (direcciones: Direccion[]) => void;
  /** false oculta el <h1>: úsalo cuando la página ya tiene su propio título (checkout). */
  mostrarTitulo?: boolean;
}

export function DireccionesList({
  modoSeleccion = false,
  direccionSeleccionadaId,
  onSeleccionar,
  onCargar,
  mostrarTitulo = true,
}: DireccionesListProps = {}) {
  const { message, modal } = App.useApp();
  const [form] = Form.useForm<DireccionInput>();

  const [direcciones, setDirecciones] = useState<Direccion[] | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Direccion | null>(null);
  const [guardando, setGuardando] = useState(false);

  function cargarDirecciones() {
    listarDirecciones()
      .then((lista) => {
        setDirecciones(lista);
        onCargar?.(lista);
      })
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudieron cargar tus direcciones'));
  }

  useEffect(() => {
    cargarDirecciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAgregar() {
    setEditando(null);
    form.resetFields();
    form.setFieldsValue({ principal: false });
    setModalAbierto(true);
  }

  function handleEditar(direccion: Direccion) {
    setEditando(direccion);
    form.setFieldsValue({
      nombreCompleto: direccion.nombreCompleto,
      telefono: direccion.telefono,
      provincia: direccion.provincia,
      ciudad: direccion.ciudad,
      calle: direccion.calle,
      referencia: direccion.referencia,
      principal: direccion.principal,
    });
    setModalAbierto(true);
  }

  function handleEliminar(direccion: Direccion) {
    modal.confirm({
      title: 'Eliminar dirección',
      content: `¿Seguro que quieres eliminar "${direccion.nombreCompleto} - ${direccion.calle}"?`,
      okText: 'Eliminar',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await eliminarDireccion(direccion.id);
          setDirecciones((actual) => actual?.filter((d) => d.id !== direccion.id) ?? actual);
          message.success('Dirección eliminada');
        } catch (error) {
          message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
        }
      },
    });
  }

  async function handleGuardar(values: DireccionInput) {
    const input: DireccionInput = { ...values, principal: !!values.principal };

    setGuardando(true);
    try {
      const guardada = editando ? await actualizarDireccion(editando.id, input) : await crearDireccion(input);

      setDirecciones((actual) => {
        const lista = actual ?? [];
        const sinDuplicado = lista.filter((d) => d.id !== guardada.id);
        const actualizada = guardada.principal ? sinDuplicado.map((d) => ({ ...d, principal: false })) : sinDuplicado;
        return [...actualizada, guardada];
      });
      message.success(editando ? 'Dirección actualizada' : 'Dirección agregada');
      setModalAbierto(false);
      if (modoSeleccion && !editando) onSeleccionar?.(guardada);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    } finally {
      setGuardando(false);
    }
  }

  if (!direcciones) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {mostrarTitulo && <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Direcciones</h1>}

      {direcciones.map((direccion) => {
        const seleccionada = modoSeleccion && direccion.id === direccionSeleccionadaId;
        return (
          <div
            key={direccion.id}
            onClick={modoSeleccion ? () => onSeleccionar?.(direccion) : undefined}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 20,
              border: seleccionada ? '2px solid var(--color-header)' : '1px solid var(--color-sidebar-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              cursor: modoSeleccion ? 'pointer' : undefined,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {modoSeleccion && (
                <CheckCircleFilled
                  style={{ fontSize: 20, color: seleccionada ? 'var(--color-header)' : '#d9d9d9', flexShrink: 0 }}
                />
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <p style={{ fontWeight: 700, margin: 0 }}>
                    {direccion.nombreCompleto} - {direccion.calle}
                  </p>
                  {direccion.principal && (
                    <Tag style={{ background: 'var(--color-header)', color: '#fff', border: 'none' }}>Principal</Tag>
                  )}
                </div>
                <p style={{ color: '#666', margin: '4px 0 0' }}>
                  {direccion.ciudad}, {direccion.provincia} · {direccion.telefono}
                </p>
                {direccion.referencia && (
                  <p style={{ color: '#8c8c8c', fontSize: 13, margin: '2px 0 0' }}>Referencia: {direccion.referencia}</p>
                )}
              </div>
            </div>
            {!modoSeleccion && (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button onClick={() => handleEditar(direccion)}>Editar</Button>
                <Button danger onClick={() => handleEliminar(direccion)}>
                  Eliminar
                </Button>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={handleAgregar}
        style={{
          background: '#fff',
          border: '1px dashed var(--color-sidebar-border)',
          borderRadius: 12,
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          color: '#8c8c8c',
          cursor: 'pointer',
        }}
      >
        <PlusOutlined style={{ fontSize: 22 }} />
        <span>Agregar nueva dirección</span>
      </button>

      <Modal
        title={editando ? 'Editar dirección' : 'Agregar dirección'}
        open={modalAbierto}
        forceRender
        onCancel={() => setModalAbierto(false)}
        onOk={() => form.submit()}
        okText="Guardar"
        confirmLoading={guardando}
      >
        <Form form={form} layout="vertical" onFinish={handleGuardar}>
          <Form.Item name="nombreCompleto" label="Nombre de quien recibe" rules={[{ required: true, message: 'Ingresa el nombre completo' }]}>
            <Input placeholder="Nombre completo" />
          </Form.Item>
          <Form.Item name="telefono" label="Teléfono" rules={[{ required: true, message: 'Ingresa un teléfono' }]}>
            <Input placeholder="0000-0000" />
          </Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="provincia" label="Provincia" style={{ flex: 1 }} rules={[{ required: true, message: 'Ingresa la provincia' }]}>
              <Input placeholder="Panamá" />
            </Form.Item>
            <Form.Item name="ciudad" label="Ciudad" style={{ flex: 1 }} rules={[{ required: true, message: 'Ingresa la ciudad' }]}>
              <Input placeholder="Ciudad de Panamá" />
            </Form.Item>
          </div>
          <Form.Item name="calle" label="Calle, casa o edificio" rules={[{ required: true, message: 'Ingresa la dirección' }]}>
            <Input placeholder="Calle 50, Edif. Las Palmas, Apto 3B" />
          </Form.Item>
          <Form.Item name="referencia" label="Referencia (opcional)">
            <Input placeholder="Frente al supermercado Rey" />
          </Form.Item>
          <Form.Item name="principal" valuePropName="checked">
            <Checkbox>Marcar como principal</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
