// src/app/(cliente)/mi-cuenta/page.tsx
import { PerfilForm } from "@/components/cliente/PerfilForm";
import { mockUsuario } from "@/lib/mock/cliente.mock";

export default function MiCuentaPage() {
  return <PerfilForm usuario={mockUsuario} />;
}
