// src/app/(dashboard)/usuarios/[id]/page.tsx
import { UsuarioInternoForm } from "@/components/dashboard/UsuarioInternoForm";

export default async function EditarUsuarioInternoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <UsuarioInternoForm usuarioId={id} />;
}
