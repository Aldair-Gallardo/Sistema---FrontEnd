// src/components/cliente/MetodosPagoList.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Modal, Select, Spin, Tag, message } from 'antd';
import { PlusOutlined, CreditCardOutlined } from '@ant-design/icons';
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

export function MetodosPagoList() {
  const [form] = Form.useForm<FormValues>();
  const tipoSeleccionado = Form.useWatch('tipo', form);

  const [metodos, setMetodos] = useState<MetodoPago[] | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<MetodoPago | null>(null);
  const [guardando, setGuardando] = useState(false);

  function cargarMetodos() {
    listarMetodosPago()
      .then(setMetodos)
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudieron cargar tus métodos de pago'));
  }

  useEffect(() => {
    cargarMetodos();
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
    Modal.confirm({
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
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Métodos de pago</h1>

      {metodos.map((metodo) => (
        <div
          key={metodo.id}
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 20,
            border: '1px solid var(--color-sidebar-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => handleEditar(metodo)}>Editar</Button>
            <Button danger onClick={() => handleEliminar(metodo)}>
              Eliminar
            </Button>
          </div>
        </div>
      ))}

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
