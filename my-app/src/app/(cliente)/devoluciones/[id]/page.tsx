// src/app/(cliente)/devoluciones/[id]/page.tsx
import { DevolucionDetalle } from "@/components/cliente/DevolucionDetalle";
import { getDevolucionById } from "@/lib/mock/cliente.mock";

export default async function DevolucionDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const devolucion = getDevolucionById(id);

  return <DevolucionDetalle devolucion={devolucion} />;
}
