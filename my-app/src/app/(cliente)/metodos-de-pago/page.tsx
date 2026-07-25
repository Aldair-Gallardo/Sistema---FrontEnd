// src/app/(cliente)/metodos-de-pago/page.tsx
import { MetodosPagoList } from "@/components/cliente/MetodosPagoList";
import { mockMetodosPago } from "@/lib/mock/cliente.mock";

export default function MetodosPagosPage() {
  return <MetodosPagoList metodos={mockMetodosPago} />;
}
