// src/types/auditoria.ts
// Tipos de la pantalla Auditoría. Calzan 1:1 con lo que devuelve GET /admin/audit
// (ver teca-backend/backend/app/routers/admin.py, sección "Auditoría", y
// app/security.py -> log_audit, que es quien escribe cada entrada).

export interface RegistroAuditoria {
  id: string;
  actorId: string | null;
  actorNombre: string;
  // El backend no restringe estos valores a un enum (ver log_audit en security.py);
  // se tipan como string y las etiquetas/colores de UI cubren los valores conocidos
  // con un genérico de respaldo para cualquier otro que aparezca.
  accion: string;
  entidad: string;
  detalle: string;
  fecha: string;
}
