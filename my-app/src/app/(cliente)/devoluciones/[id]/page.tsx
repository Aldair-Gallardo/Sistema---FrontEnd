// src/app/(cliente)/devoluciones/[id]/page.tsx
import { DevolucionDetalle } from "@/components/cliente/DevolucionDetalle";

export default async function DevolucionDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DevolucionDetalle numero={id} />;
}
