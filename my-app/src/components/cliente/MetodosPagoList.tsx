// src/components/cliente/MetodosPagoList.tsx
'use client';

import { useEffect, useState } from 'react';
import { App, Button, Checkbox, Form, Input, Modal, Select, Spin, Tag } from 'antd';
import { CheckCircleFilled, PlusOutlined, CreditCardOutlined } from '@ant-design/icons';
import {
  actualizarMetodoPago,
  crearMetodoPago,
  eliminarMetodoPago,
  listarMetodosPago,
} from '@/lib/api/cliente';
import type { MetodoPago, MetodoPagoInput, TipoMetodoPago } from '@/types/cliente';

const ETIQUETA_TIPO: Record<TipoMetodoPago, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  paypal: 'PayPal',
};

const COLOR_TIPO: Record<TipoMetodoPago, string> = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
  paypal: '#003087',
};

/** El backend solo guarda la etiqueta ya armada ("Visa terminada en 4821"); se intenta
 * recuperar los últimos 4 dígitos de ahí para prellenar el formulario de edición. */
function extraerUltimosDigitos(etiqueta: string): string | undefined {
  return etiqueta.match(/(\d{4})$/)?.[1];
}

function MetodoIcono({ tipo }: { tipo: TipoMetodoPago }) {
  return (
    <div
      style={{
        width: 48,
        height: 32,
        borderRadius: 6,
        background: COLOR_TIPO[tipo],
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {tipo === 'paypal' ? <CreditCardOutlined /> : ETIQUETA_TIPO[tipo].slice(0, 4).toUpperCase()}
    </div>
  );
}

interface FormValues {
  tipo: TipoMetodoPago;
  titular?: string;
  ultimosDigitos?: string;
  vencimiento?: string;
  correo?: string;
  principal?: boolean;
}

interface MetodosPagoListProps {
  /** true = modo "elige un método" (checkout): tarjetas clicables, sin Editar/Eliminar. */
  modoSeleccion?: boolean;
  metodoSeleccionadoId?: string;
  onSeleccionar?: (metodo: MetodoPago) => void;
  /** Se dispara una vez cuando termina de cargar la lista (para que el checkout preseleccione el principal). */
  onCargar?: (metodos: MetodoPago[]) => void;
  /** false oculta el <h1>: úsalo cuando la página ya tiene su propio título (checkout). */
  mostrarTitulo?: boolean;
}

export function MetodosPagoList({
  modoSeleccion = false,
  metodoSeleccionadoId,
  onSeleccionar,
  onCargar,
  mostrarTitulo = true,
}: MetodosPagoListProps = {}) {
  const { message, modal } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const tipoSeleccionado = Form.useWatch('tipo', form);

  const [metodos, setMetodos] = useState<MetodoPago[] | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<MetodoPago | null>(null);
  const [guardando, setGuardando] = useState(false);

  function cargarMetodos() {
    listarMetodosPago()
      .then((lista) => {
        setMetodos(lista);
        onCargar?.(lista);
      })
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudieron cargar tus métodos de pago'));
  }

  useEffect(() => {
    cargarMetodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAgregar() {
    setEditando(null);
    form.resetFields();
    form.setFieldsValue({ tipo: 'visa', principal: false });
    setModalAbierto(true);
  }

  function handleEditar(metodo: MetodoPago) {
    setEditando(metodo);
    form.setFieldsValue({
      tipo: metodo.tipo,
      titular: metodo.titular,
      ultimosDigitos: extraerUltimosDigitos(metodo.etiqueta),
      vencimiento: metodo.vencimiento,
      correo: metodo.correo,
      principal: metodo.principal,
    });
    setModalAbierto(true);
  }

  function handleEliminar(metodo: MetodoPago) {
    modal.confirm({
      title: 'Eliminar método de pago',
      content: `¿Seguro que quieres eliminar "${metodo.etiqueta}"?`,
      okText: 'Eliminar',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await eliminarMetodoPago(metodo.id);
          setMetodos((actual) => actual?.filter((m) => m.id !== metodo.id) ?? actual);
          message.success('Método de pago eliminado');
        } catch (error) {
          message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
        }
      },
    });
  }

  async function handleGuardar(values: FormValues) {
    const input: MetodoPagoInput = {
      tipo: values.tipo,
      titular: values.titular,
      ultimosDigitos: values.ultimosDigitos,
      vencimiento: values.vencimiento,
      correo: values.correo,
      principal: !!values.principal,
    };

    setGuardando(true);
    try {
      const guardado = editando
        ? await actualizarMetodoPago(editando.id, input)
        : await crearMetodoPago(input);

      setMetodos((actual) => {
        const lista = actual ?? [];
        const sinDuplicado = lista.filter((m) => m.id !== guardado.id);
        // Si el nuevo método quedó como principal, refleja eso en los demás.
        const actualizada = guardado.principal
          ? sinDuplicado.map((m) => ({ ...m, principal: false }))
          : sinDuplicado;
        return [...actualizada, guardado];
      });
      message.success(editando ? 'Método de pago actualizado' : 'Método de pago agregado');
      setModalAbierto(false);
      if (modoSeleccion && !editando) onSeleccionar?.(guardado);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    } finally {
      setGuardando(false);
    }
  }

  if (!metodos) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {mostrarTitulo && <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Métodos de pago</h1>}

      {metodos.map((metodo) => {
        const seleccionado = modoSeleccion && metodo.id === metodoSeleccionadoId;
        return (
          <div
            key={metodo.id}
            onClick={modoSeleccion ? () => onSeleccionar?.(metodo) : undefined}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 20,
              border: seleccionado ? '2px solid var(--color-header)' : '1px solid var(--color-sidebar-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              cursor: modoSeleccion ? 'pointer' : undefined,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {modoSeleccion && (
                <CheckCircleFilled
                  style={{ fontSize: 20, color: seleccionado ? 'var(--color-header)' : '#d9d9d9', flexShrink: 0 }}
                />
              )}
              <MetodoIcono tipo={metodo.tipo} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <p style={{ fontWeight: 700, margin: 0 }}>{metodo.etiqueta}</p>
                  {metodo.principal && (
                    <Tag style={{ background: 'var(--color-header)', color: '#fff', border: 'none' }}>Principal</Tag>
                  )}
                </div>
                <p style={{ color: '#666', fontSize: 13, margin: '2px 0 0' }}>
                  {metodo.tipo === 'paypal'
                    ? metodo.correo
                    : [metodo.vencimiento && `Vence ${metodo.vencimiento}`, metodo.titular].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
            {!modoSeleccion && (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button onClick={() => handleEditar(metodo)}>Editar</Button>
                <Button danger onClick={() => handleEliminar(metodo)}>
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
        <span>Agregar nuevo método de pago</span>
      </button>

      <Modal
        title={editando ? 'Editar método de pago' : 'Agregar método de pago'}
        open={modalAbierto}
        // El Modal por defecto no monta su contenido hasta abrirse, pero
        // Form.useWatch('tipo', form) de más abajo necesita el <Form> ya
        // conectado desde el primer render (si no, antd tira el warning
        // "Instance created by useForm is not connected to any Form element").
        forceRender
        onCancel={() => setModalAbierto(false)}
        onOk={() => form.submit()}
        okText="Guardar"
        confirmLoading={guardando}
      >
        <Form form={form} layout="vertical" onFinish={handleGuardar}>
          <Form.Item name="tipo" label="Tipo" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'visa', label: 'Visa' },
                { value: 'mastercard', label: 'Mastercard' },
                { value: 'paypal', label: 'PayPal' },
              ]}
            />
          </Form.Item>

          {tipoSeleccionado === 'paypal' ? (
            <Form.Item
              name="correo"
              label="Correo de PayPal"
              rules={[{ required: true, type: 'email', message: 'Ingresa un correo válido' }]}
            >
              <Input placeholder="correo@ejemplo.com" />
            </Form.Item>
          ) : (
            <>
              <Form.Item name="titular" label="Titular" rules={[{ required: true, message: 'Ingresa el nombre del titular' }]}>
                <Input placeholder="Nombre en la tarjeta" />
              </Form.Item>
              <div style={{ display: 'flex', gap: 16 }}>
                <Form.Item
                  name="ultimosDigitos"
                  label="Últimos 4 dígitos"
                  style={{ flex: 1 }}
                  rules={[
                    { required: true, message: 'Ingresa los últimos 4 dígitos' },
                    { pattern: /^\d{4}$/, message: 'Deben ser 4 números' },
                  ]}
                >
                  <Input placeholder="4821" maxLength={4} />
                </Form.Item>
                <Form.Item
                  name="vencimiento"
                  label="Vencimiento"
                  style={{ flex: 1 }}
                  rules={[{ required: true, message: 'Ej. 08/2028' }]}
                >
                  <Input placeholder="MM/AAAA" />
                </Form.Item>
              </div>
            </>
          )}

          <Form.Item name="principal" valuePropName="checked">
            <Checkbox>Marcar como principal</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
