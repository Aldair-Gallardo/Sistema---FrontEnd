// src/components/dashboard/ProductsTable.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { App, Button, Input, Select, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { actualizarProducto, listarProductosAdmin } from '@/lib/api/productos';
import { CATEGORIA_LABELS, STOCK_BAJO_UMBRAL, type Categoria, type Producto } from '@/types/producto';
import { useAuth } from '@/hooks/useAuth';
import { canAccessRoute } from '@/lib/roles';

const PAGE_SIZE = 10;
// Tope de página que acepta /admin/products (ver admin.py: page_size <= 50).
// El backend no filtra por activo ni pagina según eso, así que se trae todo
// lo que calce con búsqueda/categoría y se filtra/pagina acá.
const BACKEND_PAGE_SIZE = 50;

type Vista = 'todos' | 'bajo' | 'desactivados';

export function ProductsTable() {
  const { message, modal } = App.useApp();
  const { user } = useAuth();
  // Vendedor (y cualquier rol que no gestione productos) solo tiene lectura: se usa el
  // mismo permiso que protege /productos/nuevo para decidir si mostrar Nuevo/Editar/Eliminar/Reactivar.
  const puedeEscribir = canAccessRoute('/productos/nuevo', user?.role);

  const [todos, setTodos] = useState<Producto[] | null>(null);
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState<Categoria | undefined>();
  const [vista, setVista] = useState<Vista>('todos');

  // Trae todas las páginas de /admin/products (tope 50 por página) encadenando
  // promesas en vez de async/await, siguiendo el mismo patrón .then()/.catch()
  // que el resto de las tablas del panel.
  function traerPagina(paginaBackend: number, acumulado: Producto[]): Promise<Producto[]> {
    return listarProductosAdmin({
      search: busqueda || undefined,
      categoria,
      page: paginaBackend,
      pageSize: BACKEND_PAGE_SIZE,
    }).then(({ productos: lista, totalPaginas }) => {
      const nuevoAcumulado = acumulado.concat(lista);
      return paginaBackend >= totalPaginas ? nuevoAcumulado : traerPagina(paginaBackend + 1, nuevoAcumulado);
    });
  }

  function cargar() {
    traerPagina(1, [])
      .then(setTodos)
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudieron cargar los productos'));
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda, categoria]);

  // La tabla principal ("Todos" y "Stock bajo") nunca muestra los desactivados;
  // "Productos desactivados" muestra solo esos. Orden por stock, como antes.
  const filtrados = (todos ?? [])
    .filter((p) => (vista === 'desactivados' ? !p.activo : p.activo))
    .filter((p) => (vista === 'bajo' ? p.stock < STOCK_BAJO_UMBRAL : true))
    .sort((a, b) => a.stock - b.stock);

  const total = filtrados.length;
  const productosPagina = filtrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  function handleEliminar(producto: Producto) {
    modal.confirm({
      title: '¿Eliminar este producto?',
      content: 'El producto pasará a estado inactivo: dejará de verse en el catálogo. Sus datos no se borran de la base de datos.',
      okText: 'Eliminar',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await actualizarProducto(producto.id, { activo: false });
          message.success('Producto eliminado');
          cargar();
        } catch (error) {
          message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
        }
      },
    });
  }

  function handleReactivar(producto: Producto) {
    modal.confirm({
      title: '¿Reactivar este producto?',
      content: 'Volverá a verse en el catálogo.',
      okText: 'Reactivar',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await actualizarProducto(producto.id, { activo: true });
          message.success('Producto reactivado');
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
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      render: (activo: boolean) => (activo ? <Tag color="green">Activo</Tag> : <Tag>Inactivo</Tag>),
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
                {producto.activo ? (
                  <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleEliminar(producto)} />
                ) : (
                  <Button size="small" onClick={() => handleReactivar(producto)}>
                    Reactivar
                  </Button>
                )}
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
          style={{ minWidth: 190 }}
          value={vista}
          onChange={(valor) => {
            setPagina(1);
            setVista(valor);
          }}
          options={[
            { value: 'todos', label: 'Todos' },
            { value: 'bajo', label: 'Stock bajo' },
            { value: 'desactivados', label: 'Productos desactivados' },
          ]}
        />
      </div>

      <Table
        rowKey="id"
        loading={!todos}
        columns={columns}
        dataSource={productosPagina}
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
