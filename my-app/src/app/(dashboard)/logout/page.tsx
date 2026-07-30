// src/app/(dashboard)/logout/page.tsx
import { CerrarSesionConfirm } from "@/components/auth/CerrarSesionConfirm";

export default function LogoutAdminPage() {
  return <CerrarSesionConfirm cancelarHref="/panel" />;
}
