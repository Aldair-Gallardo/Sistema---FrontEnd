// src/components/cliente/NuevaDevolucionForm.tsx
// Nota: no había una imagen de referencia para esta pantalla en el Word;
// se diseñó siguiendo el mismo lenguaje visual que el resto de las
// pantallas de navegación de cliente.
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Form, Input, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { Pedido } from '@/types/cliente';

const MOTIVOS = [
  'Producto dañado',
  'Producto incorrecto',
  'Cambio de talla/modelo',
  'Ya no lo necesito',
  'Otro',
];

export function NuevaDevolucionForm({ pedidos }: { pedidos: Pedido[] }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [pedidoId, setPedidoId] = useState<string | undefined>();

  const pedidoSeleccionado = pedidos.find((pedido) => pedido.id === pedidoId);

  // Sin backend conectado todavía: solo se simula el envío de la solicitud.
  const handleSubmit = () => {
    message.success('Solicitud de devolución enviada (simulado, aún sin backend)');
    router.push('/devoluciones');
  };

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
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="pedido" label="Pedido" rules={[{ required: true, message: 'Selecciona un pedido' }]}>
            <Select
              placeholder="Selecciona el pedido"
              onChange={(value) => setPedidoId(value)}
              options={pedidos.map((pedido) => ({ value: pedido.id, label: `${pedido.id} · ${pedido.fecha}` }))}
            />
          </Form.Item>

          <Form.Item name="producto" label="Producto" rules={[{ required: true, message: 'Selecciona un producto' }]}>
            <Select
              placeholder={pedidoSeleccionado ? 'Selecciona el producto' : 'Primero selecciona un pedido'}
              disabled={!pedidoSeleccionado}
              options={pedidoSeleccionado?.items.map((item) => ({ value: item.id, label: item.nombre })) ?? []}
            />
          </Form.Item>

          <Form.Item name="motivo" label="Motivo" rules={[{ required: true, message: 'Selecciona un motivo' }]}>
            <Select placeholder="Selecciona un motivo" options={MOTIVOS.map((motivo) => ({ value: motivo, label: motivo }))} />
          </Form.Item>

          <Form.Item name="descripcion" label="Descripción">
            <Input.TextArea rows={4} placeholder="Cuéntanos qué pasó con el producto" />
          </Form.Item>

          <Form.Item label="Fotos (opcional)">
            <Upload beforeUpload={() => false} listType="picture" maxCount={3}>
              <Button icon={<UploadOutlined />}>Adjuntar foto</Button>
            </Upload>
          </Form.Item>

          <div style={{ display: 'flex', gap: 12 }}>
            <Button type="primary" htmlType="submit">
              Enviar solicitud
            </Button>
            <Link href="/devoluciones">
              <Button>Cancelar</Button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
