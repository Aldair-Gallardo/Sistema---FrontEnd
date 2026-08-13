// src/lib/api/auditoria.ts
// Llamadas del panel de administrador contra /admin/audit (ver
// teca-backend/backend/app/routers/admin.py, sección "Auditoría").

import { api } from "@/lib/api/client";
import type { RegistroAuditoria } from "@/types/auditoria";

interface RegistroAuditoriaBackend {
  id: string;
  actor_id: string | null;
  actor_name: string;
  action: string;
  entity: string;
  detail: string;
  timestamp: string;
}

function mapRegistro(doc: RegistroAuditoriaBackend): RegistroAuditoria {
  return {
    id: doc.id,
    actorId: doc.actor_id,
    actorNombre: doc.actor_name,
    accion: doc.action,
    entidad: doc.entity,
    detalle: doc.detail,
    fecha: doc.timestamp,
  };
}

// Tope de página que acepta /admin/audit (ver admin.py: page_size <= 100).
const BACKEND_PAGE_SIZE = 100;

interface ListarAuditoriaResultado {
  registros: RegistroAuditoria[];
  total: number;
}

function traerPagina(pagina: number, acumulado: RegistroAuditoria[]): Promise<ListarAuditoriaResultado> {
  return api(`/admin/audit?page=${pagina}&page_size=${BACKEND_PAGE_SIZE}`).then((respuesta) => {
    const nuevoAcumulado = acumulado.concat(respuesta.items.map(mapRegistro));
    return pagina >= respuesta.total_pages
      ? { registros: nuevoAcumulado, total: respuesta.total }
      : traerPagina(pagina + 1, nuevoAcumulado);
  });
}

/** Trae el historial de auditoría completo, encadenando todas las páginas del backend. */
export async function listarAuditoriaCompleta(): Promise<RegistroAuditoria[]> {
  const { registros } = await traerPagina(1, []);
  return registros;
}
