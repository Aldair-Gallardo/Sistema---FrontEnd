// src/app/(cliente)/cerrar-sesion/page.tsx
import { CerrarSesionConfirm } from "@/components/auth/CerrarSesionConfirm";

export default function CerrarSesionPage() {
  return <CerrarSesionConfirm cancelarHref="/mi-cuenta" />;
}
