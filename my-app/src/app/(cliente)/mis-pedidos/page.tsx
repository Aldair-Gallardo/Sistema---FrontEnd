// src/app/(cliente)/mis-pedidos/page.tsx
import { PedidosTable } from "@/components/cliente/PedidosTable";
import { mockPedidos } from "@/lib/mock/cliente.mock";

export default function MiPedidosPage() {
  return <PedidosTable pedidos={mockPedidos} />;
}
