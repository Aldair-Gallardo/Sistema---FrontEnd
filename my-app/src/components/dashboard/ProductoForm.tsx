// src/components/dashboard/ProductoForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { App, Button, Empty, Form, Input, InputNumber, Select, Spin, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  actualizarProducto,
  crearProducto,
  obtenerProductoAdmin,
  subirImagen,
  urlImagen,
} from '@/lib/api/productos';
import { CATEGORIA_LABELS, MATERIAL_LABELS, type Categoria, type MaterialProducto } from '@/types/producto';

const DIMENSIONES_REGEX = /^(\d+(?:\.\d+)?) cm x (\d+(?:\.\d+)?) cm x (\d+(?:\.\d+)?) cm$/;

interface FormValues {
  nombre: string;
  descripcion?: string;
  categoria: Categoria;
  material: MaterialProducto;
  color?: string;
  precio: number;
  stock: number;
  largo?: number;
  ancho?: number;
  alto?: number;
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  border: '1px solid var(--color-sidebar-border)',
};

export function ProductoForm({ productoId }: { productoId?: string }) {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();

  const [cargando, setCargando] = useState(!!productoId);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [imagenPath, setImagenPath] = useState<string | undefined>();
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (!productoId) return;
    obtenerProductoAdmin(productoId)
      .then((producto) => {
        if (!producto) {
          setNoEncontrado(true);
          return;
        }
        const dimensionesMatch = producto.dimensiones?.match(DIMENSIONES_REGEX);
        form.setFieldsValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          categoria: producto.categoria,
          material: producto.material,
          color: producto.color,
          precio: producto.precio,
          stock: producto.stock,
          largo: dimensionesMatch ? Number(dimensionesMatch[1]) : undefined,
          ancho: dimensionesMatch ? Number(dimensionesMatch[2]) : undefined,
          alto: dimensionesMatch ? Number(dimensionesMatch[3]) : undefined,
        });
        setImagenPath(producto.imagenes[0]);
        setActivo(producto.activo);
      })
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudo cargar el producto'))
      .finally(() => setCargando(false));
  }, [productoId, form, message]);

  async function handleSubirImagen(file: File) {
    setSubiendoImagen(true);
    try {
      const path = await subirImagen(file);
      setImagenPath(path);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'No se pudo subir la imagen');
    } finally {
      setSubiendoImagen(false);
    }
    return false;
  }

  async function handleSubmit(values: FormValues) {
    const dimensiones =
      values.largo && values.ancho && values.alto ? `${values.largo} cm x ${values.ancho} cm x ${values.alto} cm` : undefined;

    setGuardando(true);
    try {
      if (productoId) {
        await actualizarProducto(productoId, {
          nombre: values.nombre,
          descripcion: values.descripcion ?? '',
          precio: values.precio,
          categoria: values.categoria,
          material: values.material,
          color: values.color,
          stock: values.stock,
          imagenes: imagenPath ? [imagenPath] : [],
          dimensiones,
          activo,
        });
        message.success('Producto actualizado');
      } else {
        await crearProducto({
          nombre: values.nombre,
          descripcion: values.descripcion ?? '',
          precio: values.precio,
          categoria: values.categoria,
          material: values.material,
          color: values.color,
          stock: values.stock,
          imagenes: imagenPath ? [imagenPath] : [],
          dimensiones,
          activo: true,
        });
        message.success('Producto creado');
      }
      router.push('/productos');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    } finally {
      setGuardando(false);
    }
  }

  if (noEncontrado) {
    return (
      <div style={{ ...cardStyle, padding: 48 }}>
        <Empty description="No encontramos este producto" />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href="/productos">
            <Button>Volver a productos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{productoId ? 'Editar producto' : 'Nuevo producto'}</h1>
        <Link href="/productos">
          <Button shape="round">Volver</Button>
        </Link>
      </div>

      <Spin spinning={cargando} style={cardStyle}>
        <div style={{ display: 'flex', gap: 20, marginBottom: 20, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 8,
              background: 'var(--color-background)',
              border: '1px solid var(--color-sidebar-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            {subiendoImagen ? (
              <Spin />
            ) : imagenPath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={urlImagen(imagenPath)} alt="Producto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#8c8c8c', fontSize: 12 }}>Imagen</span>
            )}
          </div>
          <Upload beforeUpload={handleSubirImagen} showUploadList={false} accept="image/*">
            <Button icon={<UploadOutlined />} loading={subiendoImagen}>
              {imagenPath ? 'Cambiar imagen' : 'Subir imagen'}
            </Button>
          </Upload>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Información general</h2>
          <Form.Item name="nombre" label="Nombre del mueble" rules={[{ required: true, message: 'Ingresa el nombre' }]}>
            <Input placeholder="Sofá modular de 3 puestos" />
          </Form.Item>
          <Form.Item name="descripcion" label="Descripción">
            <Input.TextArea rows={3} placeholder="Descripción del producto" />
          </Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="categoria" label="Categoría" style={{ flex: 1 }} rules={[{ required: true, message: 'Selecciona una categoría' }]}>
              <Select options={Object.entries(CATEGORIA_LABELS).map(([value, label]) => ({ value, label }))} />
            </Form.Item>
            <Form.Item name="material" label="Material" style={{ flex: 1 }} rules={[{ required: true, message: 'Selecciona un material' }]}>
              <Select options={Object.entries(MATERIAL_LABELS).map(([value, label]) => ({ value, label }))} />
            </Form.Item>
          </div>
          <Form.Item name="color" label="Color/Acabado">
            <Input placeholder="Beige" />
          </Form.Item>

          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '20px 0 12px' }}>Dimensiones</h2>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="largo" label="Largo (cm)" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="ancho" label="Ancho (cm)" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="alto" label="Alto (cm)" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '20px 0 12px' }}>Precio e inventario</h2>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="precio" label="Precio $" style={{ flex: 1 }} rules={[{ required: true, message: 'Ingresa el precio' }]}>
              <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="stock" label="Stock" style={{ flex: 1 }} rules={[{ required: true, message: 'Ingresa el stock' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <Button type="primary" htmlType="submit" loading={guardando}>
              {productoId ? 'Guardar Cambios' : 'Guardar producto'}
            </Button>
            <Link href="/productos">
              <Button>Cancelar</Button>
            </Link>
          </div>
        </Form>
      </Spin>
    </div>
  );
}
