// src/app/(cliente)/mis-pedidos/[id]/page.tsx
import { PedidoDetalle } from "@/components/cliente/PedidoDetalle";

export default async function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PedidoDetalle numero={id} />;
}
