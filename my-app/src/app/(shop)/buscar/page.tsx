// src/app/(shop)/buscar/page.tsx
'use client';

import { useSearchParams } from "next/navigation";

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div className="p-8">
      <h1>Resultados para: "{query}"</h1>
      {/* Aqui se debe conectar con la logica de mi backend */}
    </div>
  );
}