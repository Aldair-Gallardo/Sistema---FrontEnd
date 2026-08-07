// src/app/(dashboard)/productos/[id]/page.tsx
import { ProductoForm } from "@/components/dashboard/ProductoForm";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProductoForm productoId={id} />;
}
