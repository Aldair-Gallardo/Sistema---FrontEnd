// src/app/(cliente)/devoluciones/nueva/page.tsx
import { NuevaDevolucionForm } from "@/components/cliente/NuevaDevolucionForm";
import { mockPedidos } from "@/lib/mock/cliente.mock";

export default function NuevaDevolucionPage() {
  return <NuevaDevolucionForm pedidos={mockPedidos} />;
}
