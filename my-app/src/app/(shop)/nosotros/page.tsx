import type { Metadata } from "next";
import PreguntasFrecuentesCliente from "./PreguntasFrecuentesCliente";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | TECA",
  description:
    "Encuentra respuestas sobre envíos, pagos, devoluciones, productos y administración de tu cuenta en TECA.",
};

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#302821]">
      {/* Encabezado */}
      <section className="border-b border-[#e5d8ca] bg-[#efe4d4]">
        <div className="mx-auto w-[calc(100%-32px)] max-w-7xl py-12 md:w-[calc(100%-48px)] md:py-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[2px] text-[#966342]">
            Centro de ayuda
          </p>

          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Preguntas frecuentes
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#675d54]">
            Encuentra respuestas sobre compras, envíos, pagos, devoluciones,
            productos y administración de tu cuenta.
          </p>
        </div>
      </section>

      <div className="pt-8">
        <PreguntasFrecuentesCliente />
      </div>
    </main>
  );
}