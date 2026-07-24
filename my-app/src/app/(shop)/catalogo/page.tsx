import type { Metadata } from "next";
import CatalogoCliente from "./CatalogoCliente";

export const metadata: Metadata = {
  title: "Catálogo de muebles | TECA",
  description:
    "Explora el catálogo de muebles para salas, dormitorios y comedores de TECA.",
};

export default function CatalogoPage() {
  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#302821]">
      {/* Encabezado del catálogo */}
      <section className="border-b border-[#e5d8ca] bg-[#efe4d4]">
        <div className="mx-auto w-[calc(100%-32px)] max-w-7xl py-12 md:w-[calc(100%-48px)] md:py-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[2px] text-[#966342]">
            Colección TECA
          </p>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Catálogo de muebles
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-[#675d54]">
                Explora nuestra colección de muebles
                seleccionados para darle comodidad, estilo y
                personalidad a cada espacio de tu hogar.
              </p>
            </div>

            <div className="hidden rounded-xl border border-[#d8c6b4] bg-white/50 px-5 py-4 text-right md:block">
              <p className="text-xs uppercase tracking-wider text-[#966342]">
                Calidad y diseño
              </p>

              <p className="mt-1 font-semibold text-[#302821]">
                Muebles para toda la vida
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-8">
        <CatalogoCliente />
      </div>
    </main>
  );
}