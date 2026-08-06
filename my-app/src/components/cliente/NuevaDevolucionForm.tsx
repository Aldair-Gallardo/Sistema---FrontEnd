// src/components/cliente/NuevaDevolucionForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { App, Button, Form, Input, Select, Spin } from 'antd';
import { listarPedidos } from '@/lib/api/pedidos';
import { crearDevolucion } from '@/lib/api/devoluciones';
import type { Pedido } from '@/types/cliente';

const MOTIVOS = ['Producto dañado', 'Producto incorrecto', 'Cambio de talla/modelo', 'Ya no lo necesito', 'Otro'];

interface FormValues {
  pedido: string;
  producto: string;
  motivo: string;
  descripcion?: string;
}

export function NuevaDevolucionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();

  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const [pedidoId, setPedidoId] = useState<string | undefined>(searchParams.get('pedido') ?? undefined);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    listarPedidos()
      .then((todos) => setPedidos(todos.filter((pedido) => pedido.estado === 'entregado')))
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudieron cargar tus pedidos'));
  }, [message]);

  useEffect(() => {
    if (pedidoId) form.setFieldValue('pedido', pedidoId);
  }, [pedidoId, form]);

  const pedidoSeleccionado = pedidos?.find((pedido) => pedido.id === pedidoId);

  async function handleSubmit(values: FormValues) {
    setEnviando(true);
    try {
      const creada = await crearDevolucion({
        pedidoId: values.pedido,
        productoId: values.producto,
        motivo: values.motivo,
        descripcion: values.descripcion,
      });
      message.success('Solicitud de devolución enviada');
      router.push(`/devoluciones/${creada.numero}`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <Link href="/devoluciones">
          <Button shape="round">Volver</Button>
        </Link>
      </div>

      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Solicitar devolución</h1>

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          border: '1px solid var(--color-sidebar-border)',
          maxWidth: 560,
        }}
      >
        {!pedidos ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <Spin />
          </div>
        ) : pedidos.length === 0 ? (
          <p style={{ color: '#666', margin: 0 }}>
            Solo se pueden solicitar devoluciones o cambios de pedidos ya entregados. Aún no tienes ninguno.
          </p>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="pedido" label="Pedido" rules={[{ required: true, message: 'Selecciona un pedido' }]}>
              <Select
                placeholder="Selecciona el pedido"
                onChange={(value) => setPedidoId(value)}
                options={pedidos.map((pedido) => ({
                  value: pedido.id,
                  label: `${pedido.id} · ${new Date(pedido.fecha).toLocaleDateString('es-PA')}`,
                }))}
              />
            </Form.Item>

            <Form.Item name="producto" label="Producto" rules={[{ required: true, message: 'Selecciona un producto' }]}>
              <Select
                placeholder={pedidoSeleccionado ? 'Selecciona el producto' : 'Primero selecciona un pedido'}
                disabled={!pedidoSeleccionado}
                options={pedidoSeleccionado?.items.map((item) => ({ value: item.productoId, label: item.nombre })) ?? []}
              />
            </Form.Item>

            <Form.Item name="motivo" label="Motivo" rules={[{ required: true, message: 'Selecciona un motivo' }]}>
              <Select placeholder="Selecciona un motivo" options={MOTIVOS.map((motivo) => ({ value: motivo, label: motivo }))} />
            </Form.Item>

            <Form.Item name="descripcion" label="Descripción">
              <Input.TextArea rows={4} maxLength={400} showCount placeholder="Cuéntanos qué pasó con el producto" />
            </Form.Item>

            <div style={{ display: 'flex', gap: 12 }}>
              <Button type="primary" htmlType="submit" loading={enviando}>
                Enviar solicitud
              </Button>
              <Link href="/devoluciones">
                <Button>Cancelar</Button>
              </Link>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}
