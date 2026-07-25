// src/app/(cliente)/mis-pedidos/[id]/page.tsx
import { PedidoDetalle } from "@/components/cliente/PedidoDetalle";
import { getPedidoById } from "@/lib/mock/cliente.mock";

export default async function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pedido = getPedidoById(id);

  return <PedidoDetalle pedido={pedido} />;
}
