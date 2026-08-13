// src/app/(shop)/buscar/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import CatalogoCliente from "../catalogo/CatalogoCliente";

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#302821]">
      <section className="border-b border-[#e5d8ca] bg-[#efe4d4]">
        <div className="mx-auto w-[calc(100%-32px)] max-w-7xl py-10 md:w-[calc(100%-48px)]">
          <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#966342]">
            Búsqueda
          </p>

          <h1 className="text-2xl font-semibold md:text-3xl">
            {query ? `Resultados para: "${query}"` : "Resultados de la búsqueda"}
          </h1>
        </div>
      </section>

      <div className="pt-8">
        <CatalogoCliente busqueda={query} />
      </div>
    </main>
  );
}
