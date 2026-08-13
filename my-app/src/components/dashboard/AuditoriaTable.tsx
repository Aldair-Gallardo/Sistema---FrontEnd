// src/components/dashboard/AuditoriaTable.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { App, Input, Select, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { listarAuditoriaCompleta } from '@/lib/api/auditoria';
import type { RegistroAuditoria } from '@/types/auditoria';

const PAGE_SIZE = 15;

const ACCION_LABELS: Record<string, string> = {
  crear: 'Crear',
  editar: 'Editar',
  eliminar: 'Eliminar',
  'actualizar-estado': 'Actualizar estado',
  subir: 'Subir',
};

const ACCION_COLORS: Record<string, string> = {
  crear: 'green',
  editar: 'blue',
  eliminar: 'red',
  'actualizar-estado': 'orange',
  subir: 'purple',
};

const ENTIDAD_LABELS: Record<string, string> = {
  usuario: 'Usuario',
  producto: 'Producto',
  pedido: 'Pedido',
  cupón: 'Cupón',
  devolución: 'Devolución',
  imagen: 'Imagen',
};

function etiquetaAccion(accion: string): string {
  return ACCION_LABELS[accion] ?? accion;
}

function etiquetaEntidad(entidad: string): string {
  return ENTIDAD_LABELS[entidad] ?? entidad;
}

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleString('es-PA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AuditoriaTable() {
  const { message } = App.useApp();

  const [registros, setRegistros] = useState<RegistroAuditoria[] | null>(null);
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [accion, setAccion] = useState<string | undefined>();
  const [entidad, setEntidad] = useState<string | undefined>();

  useEffect(() => {
    listarAuditoriaCompleta()
      .then(setRegistros)
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudo cargar la auditoría'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accionesDisponibles = useMemo(
    () => Array.from(new Set((registros ?? []).map((r) => r.accion))),
    [registros]
  );
  const entidadesDisponibles = useMemo(
    () => Array.from(new Set((registros ?? []).map((r) => r.entidad))),
    [registros]
  );

  const filtrados = useMemo(() => {
    if (!registros) return [];
    const texto = busqueda.trim().toLowerCase();
    return registros.filter((r) => {
      if (accion && r.accion !== accion) return false;
      if (entidad && r.entidad !== entidad) return false;
      if (texto && !r.actorNombre.toLowerCase().includes(texto) && !r.detalle.toLowerCase().includes(texto)) {
        return false;
      }
      return true;
    });
  }, [registros, busqueda, accion, entidad]);

  const total = filtrados.length;
  const registrosPagina = filtrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  const columns: ColumnsType<RegistroAuditoria> = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      render: (fecha: string) => formatearFecha(fecha),
    },
    { title: 'Usuario', dataIndex: 'actorNombre', key: 'actorNombre' },
    {
      title: 'Acción',
      dataIndex: 'accion',
      key: 'accion',
      render: (valor: string) => <Tag color={ACCION_COLORS[valor]}>{etiquetaAccion(valor)}</Tag>,
    },
    {
      title: 'Entidad',
      dataIndex: 'entidad',
      key: 'entidad',
      render: (valor: string) => etiquetaEntidad(valor),
    },
    { title: 'Detalle', dataIndex: 'detalle', key: 'detalle' },
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
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 20 }}>Auditoría</h1>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar por usuario o detalle..."
          allowClear
          style={{ flex: 1, minWidth: 220 }}
          onSearch={(valor) => {
            setPagina(1);
            setBusqueda(valor);
          }}
        />
        <Select
          placeholder="Acción"
          allowClear
          style={{ minWidth: 180 }}
          value={accion}
          onChange={(valor) => {
            setPagina(1);
            setAccion(valor);
          }}
          options={accionesDisponibles.map((a) => ({ value: a, label: etiquetaAccion(a) }))}
        />
        <Select
          placeholder="Entidad"
          allowClear
          style={{ minWidth: 180 }}
          value={entidad}
          onChange={(valor) => {
            setPagina(1);
            setEntidad(valor);
          }}
          options={entidadesDisponibles.map((e) => ({ value: e, label: etiquetaEntidad(e) }))}
        />
      </div>

      <Table
        rowKey="id"
        loading={!registros}
        columns={columns}
        dataSource={registrosPagina}
        pagination={{
          current: pagina,
          pageSize: PAGE_SIZE,
          total,
          onChange: setPagina,
          showTotal: (totalItems, rango) => `Mostrando ${rango[1]} de ${totalItems} registros`,
        }}
      />
    </div>
  );
}
