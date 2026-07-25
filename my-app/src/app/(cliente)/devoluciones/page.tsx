// src/app/(cliente)/devoluciones/page.tsx
import { DevolucionesList } from "@/components/cliente/DevolucionesList";
import { mockDevoluciones } from "@/lib/mock/cliente.mock";

export default function DevolucionesPage() {
  return <DevolucionesList devoluciones={mockDevoluciones} />;
}
