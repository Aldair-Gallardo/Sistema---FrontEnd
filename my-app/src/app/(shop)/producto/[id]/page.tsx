// src/app/(shop)/producto/[id]/page.tsx
import { ProductoDetalle } from "@/components/producto/ProductoDetalle";

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProductoDetalle productoId={id} />;
}
