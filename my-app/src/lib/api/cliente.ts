// src/lib/api/cliente.ts
// Llamadas del área de cliente contra /auth/me y /account (ver
// teca-backend/backend/app/routers/auth.py y app/routers/account.py). a

import { api } from "@/lib/api/client";
import type { MetodoPago, MetodoPagoInput, TipoMetodoPago, UsuarioCliente } from "@/types/cliente";
import { ROLE_LABELS, toRole } from "@/lib/roles";

function iniciales(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

interface PerfilBackend {
  id: string;
  name: string;
  email: string;
  phone?: string;
  /** Rol tal como lo manda el backend (en español); se traduce con toRole(). */
  role: string;
}

function mapUsuarioCliente(doc: PerfilBackend): UsuarioCliente {
  return {
    nombre: doc.name,
    correo: doc.email,
    telefono: doc.phone,
    rol: ROLE_LABELS[toRole(doc.role)],
    iniciales: iniciales(doc.name),
  };
}

export async function obtenerPerfil(): Promise<UsuarioCliente> {
  const doc = await api("/auth/me");
  return mapUsuarioCliente(doc);
}

export async function actualizarPerfil(datos: { nombre?: string; telefono?: string }): Promise<UsuarioCliente> {
  const doc = await api("/auth/me", {
    method: "PATCH",
    body: JSON.stringify({ name: datos.nombre, phone: datos.telefono }),
  });
  return mapUsuarioCliente(doc);
}

export async function cambiarPassword(datos: { actual: string; nueva: string }): Promise<void> {
  await api("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ current_password: datos.actual, new_password: datos.nueva }),
  });
}

interface MetodoPagoBackend {
  id: string;
  type: TipoMetodoPago;
  label: string;
  holder_name?: string;
  expires?: string;
  email?: string;
  is_default: boolean;
}

function mapMetodoPago(doc: MetodoPagoBackend): MetodoPago {
  return {
    id: doc.id,
    tipo: doc.type,
    etiqueta: doc.label,
    titular: doc.holder_name,
    vencimiento: doc.expires,
    correo: doc.email,
    principal: doc.is_default,
  };
}

const ETIQUETA_TIPO: Record<TipoMetodoPago, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  paypal: "PayPal",
};

/** Arma el texto final que guarda el backend; el número de tarjeta nunca se envía ni se guarda. */
function construirEtiqueta(input: MetodoPagoInput): string {
  if (input.tipo === "paypal") return "PayPal";
  return `${ETIQUETA_TIPO[input.tipo]} terminada en ${input.ultimosDigitos ?? "----"}`;
}

function mapMetodoPagoInput(input: MetodoPagoInput) {
  return {
    type: input.tipo,
    label: construirEtiqueta(input),
    holder_name: input.titular,
    expires: input.vencimiento,
    email: input.correo,
    is_default: input.principal,
  };
}

export async function listarMetodosPago(): Promise<MetodoPago[]> {
  const docs = await api("/account/payment-methods");
  return docs.map(mapMetodoPago);
}

export async function crearMetodoPago(input: MetodoPagoInput): Promise<MetodoPago> {
  const doc = await api("/account/payment-methods", {
    method: "POST",
    body: JSON.stringify(mapMetodoPagoInput(input)),
  });
  return mapMetodoPago(doc);
}

export async function actualizarMetodoPago(id: string, input: MetodoPagoInput): Promise<MetodoPago> {
  const doc = await api(`/account/payment-methods/${id}`, {
    method: "PUT",
    body: JSON.stringify(mapMetodoPagoInput(input)),
  });
  return mapMetodoPago(doc);
}

export async function eliminarMetodoPago(id: string): Promise<void> {
  await api(`/account/payment-methods/${id}`, { method: "DELETE" });
}
