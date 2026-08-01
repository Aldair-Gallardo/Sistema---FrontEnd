"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categoriasFAQ } from "./faqData";

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function PreguntasFrecuentesCliente() {
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(
    "envios",
  );

  const [busqueda, setBusqueda] = useState("");

  const categoriasFiltradas = useMemo(() => {
    const termino = normalizarTexto(busqueda.trim());

    if (!termino) {
      return categoriasFAQ;
    }

    return categoriasFAQ
      .map((categoria) => {
        const coincideCategoria =
          normalizarTexto(categoria.titulo).includes(termino) ||
          normalizarTexto(categoria.descripcion).includes(termino);

        if (coincideCategoria) {
          return categoria;
        }

        const preguntasCoincidentes = categoria.preguntas.filter(
          (item) =>
            normalizarTexto(item.pregunta).includes(termino) ||
            normalizarTexto(item.respuesta).includes(termino),
        );

        return {
          ...categoria,
          preguntas: preguntasCoincidentes,
        };
      })
      .filter((categoria) => categoria.preguntas.length > 0);
  }, [busqueda]);

  const cambiarCategoria = (categoriaId: string) => {
    setCategoriaActiva((categoriaActual) =>
      categoriaActual === categoriaId ? null : categoriaId,
    );
  };

  const busquedaActiva = busqueda.trim().length > 0;

  return (
    <section className="mx-auto w-[calc(100%-32px)] max-w-7xl pb-16 md:w-[calc(100%-48px)]">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
        {/* Preguntas frecuentes */}
        <div>
          {/* Buscador */}
          <div className="relative mb-5">
            <span
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#8a7b6f]"
            >
              ⌕
            </span>

            <input
              type="search"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Buscar en preguntas frecuentes..."
              className="w-full rounded-xl border border-[#ded3c7] bg-white py-3.5 pl-12 pr-4 text-sm text-[#302821] outline-none transition placeholder:text-[#a4998f] focus:border-[#795538] focus:ring-2 focus:ring-[#795538]/15"
            />
          </div>

          {/* Categorías */}
          <div className="space-y-3">
            {categoriasFiltradas.map((categoria) => {
              const estaAbierta =
                busquedaActiva || categoriaActiva === categoria.id;

              return (
                <article
                  key={categoria.id}
                  className="overflow-hidden rounded-xl border border-[#e4d9ce] bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => cambiarCategoria(categoria.id)}
                    aria-expanded={estaAbierta}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-[#faf6f0]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f0e4d7] text-xl">
                      {categoria.icono}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-[#302821]">
                        {categoria.titulo}
                      </span>

                      <span className="mt-1 block text-sm text-[#756b63]">
                        {categoria.descripcion}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className={`text-xl text-[#795538] transition-transform ${
                        estaAbierta ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </button>

                  {estaAbierta && (
                    <div className="border-t border-[#eee5dc] bg-[#fcfaf7] px-5 py-5">
                      <div className="space-y-4">
                        {categoria.preguntas.map((item) => (
                          <div
                            key={item.pregunta}
                            className="rounded-lg border border-[#e8ded4] bg-white p-4"
                          >
                            <h3 className="font-semibold text-[#302821]">
                              {item.pregunta}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#675d54]">
                              {item.respuesta}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* Sin resultados */}
          {categoriasFiltradas.length === 0 && (
            <div className="rounded-xl border border-[#e4d9ce] bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0e4d7] text-2xl font-bold text-[#795538]">
                ?
              </div>

              <h2 className="mt-4 text-xl font-semibold text-[#302821]">
                No encontramos resultados
              </h2>

              <p className="mt-2 text-sm text-[#756b63]">
                Prueba utilizando otras palabras o comunícate con nosotros.
              </p>

              <button
                type="button"
                onClick={() => setBusqueda("")}
                className="mt-5 rounded-md border border-[#795538] px-5 py-2.5 text-sm font-semibold text-[#795538] transition hover:bg-[#f3e8dc]"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}
        </div>

        {/* Contacto */}
        <aside className="rounded-xl border border-[#e4d9ce] bg-white p-7 text-center shadow-sm lg:sticky lg:top-24">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f0e4d7] text-3xl font-bold text-[#795538]">
            ?
          </div>

          <h2 className="mt-5 text-2xl font-semibold leading-tight text-[#302821]">
            ¿No encontraste lo que buscabas?
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#756b63]">
            Escríbenos y con gusto te ayudaremos a resolver cualquier duda.
          </p>

          <Link
            href="/contacto"
            className="mt-7 flex w-full items-center justify-center rounded-md bg-[#795538] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#60412d]"
          >
            Ir a contacto
          </Link>
        </aside>
      </div>

      {/* Beneficios */}
      <div className="mt-10 grid overflow-hidden rounded-xl border border-[#e4d9ce] bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <Beneficio
          icono="🚚"
          titulo="Envíos seguros"
          texto="A todo el país"
        />

        <Beneficio
          icono="◆"
          titulo="Pagos seguros"
          texto="Protección en tu compra"
        />

        <Beneficio
          icono="★"
          titulo="Calidad garantizada"
          texto="Muebles para toda la vida"
        />

        <Beneficio
          icono="☎"
          titulo="Atención personalizada"
          texto="Estamos para ayudarte"
        />
      </div>
    </section>
  );
}

type BeneficioProps = {
  icono: string;
  titulo: string;
  texto: string;
};

function Beneficio({ icono, titulo, texto }: BeneficioProps) {
  return (
    <div className="flex items-center gap-4 border-b border-[#eee5dc] p-5 last:border-b-0 sm:border-r lg:border-b-0 lg:last:border-r-0">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0e4d7] font-bold text-[#795538]">
        {icono}
      </span>

      <div>
        <p className="text-sm font-semibold text-[#302821]">{titulo}</p>

        <p className="mt-1 text-xs text-[#756b63]">{texto}</p>
      </div>
    </div>
  );
}