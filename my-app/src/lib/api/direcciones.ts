// src/lib/api/direcciones.ts
// Llamadas del área de cliente contra /account/addresses (ver
// teca-backend/backend/app/routers/account.py).

import { api } from "@/lib/api/client";
import type { Direccion, DireccionInput } from "@/types/cliente";

interface DireccionBackend {
  id: string;
  full_name: string;
  phone: string;
  province: string;
  city: string;
  address_line: string;
  reference?: string;
  is_default: boolean;
}

function mapDireccion(doc: DireccionBackend): Direccion {
  return {
    id: doc.id,
    nombreCompleto: doc.full_name,
    telefono: doc.phone,
    provincia: doc.province,
    ciudad: doc.city,
    calle: doc.address_line,
    referencia: doc.reference,
    principal: doc.is_default,
  };
}

function mapDireccionInput(input: DireccionInput) {
  return {
    full_name: input.nombreCompleto,
    phone: input.telefono,
    province: input.provincia,
    city: input.ciudad,
    address_line: input.calle,
    reference: input.referencia,
    is_default: input.principal,
  };
}

export async function listarDirecciones(): Promise<Direccion[]> {
  const docs = await api("/account/addresses");
  return docs.map(mapDireccion);
}

export async function crearDireccion(input: DireccionInput): Promise<Direccion> {
  const doc = await api("/account/addresses", {
    method: "POST",
    body: JSON.stringify(mapDireccionInput(input)),
  });
  return mapDireccion(doc);
}

export async function actualizarDireccion(id: string, input: DireccionInput): Promise<Direccion> {
  const doc = await api(`/account/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(mapDireccionInput(input)),
  });
  return mapDireccion(doc);
}

export async function eliminarDireccion(id: string): Promise<void> {
  await api(`/account/addresses/${id}`, { method: "DELETE" });
}
