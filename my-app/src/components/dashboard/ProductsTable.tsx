// src/components/dashboard/ProductsTable.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { App, Button, Input, Select, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { eliminarProducto, listarProductosAdmin } from '@/lib/api/productos';
import { CATEGORIA_LABELS, STOCK_BAJO_UMBRAL, type Categoria, type Producto } from '@/types/producto';
import { useAuth } from '@/hooks/useAuth';
import { canAccessRoute } from '@/lib/roles';

const PAGE_SIZE = 10;

type FiltroStock = 'todos' | 'bajo';

export function ProductsTable() {
  const { message, modal } = App.useApp();
  const { user } = useAuth();
  // Vendedor (y cualquier rol que no gestione productos) solo tiene lectura: se usa el
  // mismo permiso que protege /productos/nuevo para decidir si mostrar Nuevo/Editar/Eliminar.
  const puedeEscribir = canAccessRoute('/productos/nuevo', user?.role);

  const [productos, setProductos] = useState<Producto[] | null>(null);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState<Categoria | undefined>();
  const [filtroStock, setFiltroStock] = useState<FiltroStock>('todos');

  function cargar() {
    listarProductosAdmin({
      search: busqueda || undefined,
      categoria,
      stockBajo: filtroStock === 'bajo',
      page: pagina,
      pageSize: PAGE_SIZE,
    })
      .then(({ productos: lista, total: totalItems }) => {
        // El backend no soporta ordenar /admin/products por stock, así que se ordena
        // acá el resultado de la página actual (los de stock más bajo primero).
        setProductos([...lista].sort((a, b) => a.stock - b.stock));
        setTotal(totalItems);
      })
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudieron cargar los productos'));
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, busqueda, categoria, filtroStock]);

  function handleEliminar(producto: Producto) {
    modal.confirm({
      title: '¿Eliminar este producto?',
      content: 'Esta acción no se puede deshacer. El producto se eliminará del catálogo.',
      okText: 'Eliminar',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await eliminarProducto(producto.id);
          message.success('Producto eliminado');
          cargar();
        } catch (error) {
          message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
        }
      },
    });
  }

  const columns: ColumnsType<Producto> = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', render: (nombre) => <b>{nombre}</b> },
    {
      title: 'Categoría',
      dataIndex: 'categoria',
      key: 'categoria',
      render: (categoria: Categoria) => CATEGORIA_LABELS[categoria],
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      render: (precio: number) => `B/. ${precio.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (stock < STOCK_BAJO_UMBRAL ? <Tag color="red">{stock}</Tag> : stock),
    },
    ...(puedeEscribir
      ? [
          {
            title: 'Acciones',
            key: 'acciones',
            render: (_: unknown, producto: Producto) => (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/productos/${producto.id}`}>
                  <Button size="small" icon={<EditOutlined />} />
                </Link>
                <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleEliminar(producto)} />
              </div>
            ),
          },
        ]
      : []),
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
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Productos</h1>
        {puedeEscribir && (
          <Link href="/productos/nuevo">
            <Button type="primary" icon={<PlusOutlined />}>
              Nuevo
            </Button>
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar producto..."
          allowClear
          style={{ flex: 1, minWidth: 220 }}
          onSearch={(valor) => {
            setPagina(1);
            setBusqueda(valor);
          }}
        />
        <Select
          placeholder="Categoría"
          allowClear
          style={{ minWidth: 160 }}
          value={categoria}
          onChange={(valor) => {
            setPagina(1);
            setCategoria(valor);
          }}
          options={Object.entries(CATEGORIA_LABELS).map(([value, label]) => ({ value, label }))}
        />
        <Select
          style={{ minWidth: 160 }}
          value={filtroStock}
          onChange={(valor) => {
            setPagina(1);
            setFiltroStock(valor);
          }}
          options={[
            { value: 'todos', label: 'Todos' },
            { value: 'bajo', label: 'Stock bajo' },
          ]}
        />
      </div>

      <Table
        rowKey="id"
        loading={!productos}
        columns={columns}
        dataSource={productos ?? []}
        pagination={{
          current: pagina,
          pageSize: PAGE_SIZE,
          total,
          onChange: setPagina,
          showTotal: (totalItems, rango) => `Mostrando ${rango[1]} de ${totalItems} productos`,
        }}
      />
    </div>
  );
}
