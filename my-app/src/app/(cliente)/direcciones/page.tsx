// src/app/(cliente)/direcciones/page.tsx
import { DireccionesList } from "@/components/cliente/DireccionesList";
import { mockDirecciones } from "@/lib/mock/cliente.mock";

export default function DireccionesPage() {
  return <DireccionesList direcciones={mockDirecciones} />;
}
