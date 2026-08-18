"use client";

import { useEffect, useMemo, useState } from "react";
import ProductoCard from "./ProductoCard";
import { listarProductosPublicos } from "@/lib/api/productos";
import {
  CATEGORIA_LABELS,
  MATERIAL_LABELS,
  type Categoria,
  type MaterialProducto,
  type Producto,
} from "@/types/producto";

type TipoOrden =
  | "recomendados"
  | "precio-menor"
  | "precio-mayor"
  | "nombre";

const PRECIO_MAXIMO_TOPE = 3000;

interface CatalogoClienteProps {
  /** Texto de búsqueda (de /buscar?q=...). Sin esto se comporta como el catálogo completo. */
  busqueda?: string;
}

export default function CatalogoCliente({ busqueda }: CatalogoClienteProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  // Sugerencias para cuando una búsqueda no encuentra nada ("Quizás te interese").
  const [sugerencias, setSugerencias] = useState<Producto[]>([]);

  const [precioMaximo, setPrecioMaximo] = useState(PRECIO_MAXIMO_TOPE);

  const [
    categoriasSeleccionadas,
    setCategoriasSeleccionadas,
  ] = useState<Categoria[]>([]);

  const [
    materialesSeleccionados,
    setMaterialesSeleccionados,
  ] = useState<MaterialProducto[]>([]);

  const [orden, setOrden] =
    useState<TipoOrden>("recomendados");

  useEffect(() => {
    let componenteActivo = true;

    const cargarProductos = async () => {
      try {
        setCargando(true);
        setError(null);

        const resultado = await listarProductosPublicos({
          pagina: 1,
          productosPorPagina: 50,
          orden: "relevance",
          search: busqueda || undefined,
        });

        if (componenteActivo) {
          setProductos(resultado.productos);
        }
      } catch (errorDesconocido) {
        if (componenteActivo) {
          setError(
            errorDesconocido instanceof Error
              ? errorDesconocido.message
              : "No se pudieron cargar los productos.",
          );
        }
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    };

    cargarProductos();

    return () => {
      componenteActivo = false;
    };
  }, [intento, busqueda]);

  // Si la búsqueda no encontró nada, traemos algunos productos generales para
  // sugerir en "Quizás te interese" (sin el filtro de texto).
  useEffect(() => {
    let componenteActivo = true;

    const cargarSugerencias = async () => {
      if (!busqueda || cargando || productos.length > 0) {
        if (componenteActivo) setSugerencias([]);
        return;
      }

      try {
        const resultado = await listarProductosPublicos({ pagina: 1, productosPorPagina: 4, orden: "relevance" });
        if (componenteActivo) setSugerencias(resultado.productos);
      } catch {
        if (componenteActivo) setSugerencias([]);
      }
    };

    cargarSugerencias();

    return () => {
      componenteActivo = false;
    };
  }, [busqueda, cargando, productos]);

  const categorias = useMemo<Categoria[]>(() => {
    return Array.from(
      new Set(
        productos.map((producto) => producto.categoria),
      ),
    );
  }, [productos]);

  const materiales = useMemo<MaterialProducto[]>(() => {
    return Array.from(
      new Set(
        productos.map((producto) => producto.material),
      ),
    );
  }, [productos]);

  const alternarCategoria = (categoria: Categoria) => {
    setCategoriasSeleccionadas((actuales) => {
      if (actuales.includes(categoria)) {
        return actuales.filter(
          (categoriaActual) =>
            categoriaActual !== categoria,
        );
      }

      return [...actuales, categoria];
    });
  };

  const alternarMaterial = (
    material: MaterialProducto,
  ) => {
    setMaterialesSeleccionados((actuales) => {
      if (actuales.includes(material)) {
        return actuales.filter(
          (materialActual) =>
            materialActual !== material,
        );
      }

      return [...actuales, material];
    });
  };

  const limpiarFiltros = () => {
    setPrecioMaximo(PRECIO_MAXIMO_TOPE);
    setCategoriasSeleccionadas([]);
    setMaterialesSeleccionados([]);
    setOrden("recomendados");
  };

  const productosFiltrados = useMemo<Producto[]>(() => {
    const resultado = productos.filter((producto) => {
      const cumplePrecio =
        producto.precio <= precioMaximo;

      const cumpleCategoria =
        categoriasSeleccionadas.length === 0 ||
        categoriasSeleccionadas.includes(
          producto.categoria,
        );

      const cumpleMaterial =
        materialesSeleccionados.length === 0 ||
        materialesSeleccionados.includes(
          producto.material,
        );

      return (
        cumplePrecio &&
        cumpleCategoria &&
        cumpleMaterial
      );
    });

    return ordenarProductos(resultado, orden);
  }, [
    productos,
    precioMaximo,
    categoriasSeleccionadas,
    materialesSeleccionados,
    orden,
  ]);

  if (cargando) {
    return (
      <section className="mx-auto w-[calc(100%-32px)] max-w-7xl pb-20 md:w-[calc(100%-48px)]">
        <div className="rounded-xl border border-[#e7ddd2] bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#e2d5c8] border-t-[#795538]" />

          <p className="mt-4 text-sm text-[#756b63]">
            Cargando productos...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-[calc(100%-32px)] max-w-7xl pb-20 md:w-[calc(100%-48px)]">
        <div className="rounded-xl border border-red-200 bg-white px-6 py-16 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-[#302821]">
            No se pudo cargar el catálogo
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              setIntento((intentoActual) => intentoActual + 1)
            }
            className="mt-5 rounded-md bg-[#795538] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#60412d]"
          >
            Intentar nuevamente
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-[calc(100%-32px)] max-w-7xl pb-20 md:w-[calc(100%-48px)]">
      <div className="grid items-start gap-7 lg:grid-cols-[250px_1fr]">
        {/* Panel de filtros */}
        <aside className="rounded-xl border border-[#e7ddd2] bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <div className="border-b border-[#eee5dc] pb-4">
            <p className="text-xs font-semibold uppercase tracking-[2px] text-[#966342]">
              Catálogo
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[#302821]">
              Filtros
            </h2>
          </div>

          {/* Precio máximo */}
          <div className="border-b border-[#eee5dc] py-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-[#302821]">
                Precio máximo
              </h3>

              <span className="rounded bg-[#f3e8dc] px-2 py-1 text-sm font-semibold text-[#795538]">
                ${precioMaximo}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={PRECIO_MAXIMO_TOPE}
              step={50}
              value={precioMaximo}
              onChange={(evento) =>
                setPrecioMaximo(
                  Number(evento.target.value),
                )
              }
              className="w-full cursor-pointer accent-[#795538]"
              aria-label="Precio máximo"
            />

            <div className="mt-2 flex justify-between text-xs text-[#756b63]">
              <span>$0</span>
              <span>${PRECIO_MAXIMO_TOPE}</span>
            </div>
          </div>

          {/* Categorías */}
          <div className="border-b border-[#eee5dc] py-5">
            <h3 className="mb-3 font-semibold text-[#302821]">
              Categoría
            </h3>

            <div className="space-y-3">
              {categorias.map((categoria) => (
                <label
                  key={categoria}
                  className="flex cursor-pointer items-center gap-3 text-sm text-[#51483f]"
                >
                  <input
                    type="checkbox"
                    checked={categoriasSeleccionadas.includes(
                      categoria,
                    )}
                    onChange={() =>
                      alternarCategoria(categoria)
                    }
                    className="h-4 w-4 accent-[#795538]"
                  />

                  <span>
                    {CATEGORIA_LABELS[categoria]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Materiales */}
          <div className="py-5">
            <h3 className="mb-3 font-semibold text-[#302821]">
              Material
            </h3>

            <div className="space-y-3">
              {materiales.map((material) => (
                <label
                  key={material}
                  className="flex cursor-pointer items-center gap-3 text-sm text-[#51483f]"
                >
                  <input
                    type="checkbox"
                    checked={materialesSeleccionados.includes(
                      material,
                    )}
                    onChange={() =>
                      alternarMaterial(material)
                    }
                    className="h-4 w-4 accent-[#795538]"
                  />

                  <span>
                    {MATERIAL_LABELS[material]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={limpiarFiltros}
            className="w-full rounded-md border border-[#795538] px-4 py-2 text-sm font-semibold text-[#795538] transition hover:bg-[#f3e8dc]"
          >
            Limpiar filtros
          </button>
        </aside>

        {/* Área de productos */}
        <div>
          <div className="mb-6 flex flex-col gap-4 rounded-xl border border-[#e7ddd2] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#51483f]">
              Mostrando{" "}
              <strong className="text-[#302821]">
                {productosFiltrados.length}
              </strong>{" "}
              de{" "}
              <strong className="text-[#302821]">
                {productos.length}
              </strong>{" "}
              productos
            </p>

            <div className="flex items-center gap-3">
              <label
                htmlFor="orden-productos"
                className="text-sm font-medium text-[#51483f]"
              >
                Ordenar por:
              </label>

              <select
                id="orden-productos"
                value={orden}
                onChange={(evento) =>
                  setOrden(
                    evento.target.value as TipoOrden,
                  )
                }
                className="rounded-md border border-[#d8cec4] bg-white px-3 py-2 text-sm text-[#302821] outline-none transition focus:border-[#795538] focus:ring-2 focus:ring-[#795538]/20"
              >
                <option value="recomendados">
                  Recomendados
                </option>

                <option value="precio-menor">
                  Precio: menor a mayor
                </option>

                <option value="precio-mayor">
                  Precio: mayor a menor
                </option>

                <option value="nombre">
                  Nombre
                </option>
              </select>
            </div>
          </div>

          {productosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {productosFiltrados.map((producto) => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </div>
          ) : busqueda && productos.length === 0 ? (
            <div>
              <div className="rounded-xl border border-[#e7ddd2] bg-white px-6 py-16 text-center shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="mx-auto h-12 w-12 text-[#c9b8a4]"
                  aria-hidden="true"
                >
                  <circle cx="10" cy="10" r="6" />
                  <path strokeLinecap="round" d="m20 20-4.3-4.3M8 8l4 4m0-4-4 4" />
                </svg>

                <h2 className="mt-4 text-xl font-semibold text-[#302821]">
                  No encontramos resultados para &quot;{busqueda}&quot;
                </h2>

                <p className="mt-2 text-sm text-[#756b63]">
                  Revisa que la palabra esté bien escrita.
                </p>
              </div>

              {sugerencias.length > 0 && (
                <div className="mt-10">
                  <h3 className="mb-4 text-lg font-semibold text-[#302821]">
                    Quizás te interese
                  </h3>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {sugerencias.map((producto) => (
                      <ProductoCard key={producto.id} producto={producto} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-[#e7ddd2] bg-white px-6 py-16 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-[#302821]">
                No encontramos productos
              </h2>

              <p className="mt-2 text-sm text-[#756b63]">
                Selecciona otros filtros o aumenta el
                precio máximo.
              </p>

              <button
                type="button"
                onClick={limpiarFiltros}
                className="mt-5 rounded-md bg-[#795538] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#60412d]"
              >
                Mostrar todos
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ordenarProductos(
  listaProductos: Producto[],
  orden: TipoOrden,
): Producto[] {
  const productosOrdenados = [...listaProductos];

  switch (orden) {
    case "precio-menor":
      return productosOrdenados.sort(
        (productoA, productoB) =>
          productoA.precio - productoB.precio,
      );

    case "precio-mayor":
      return productosOrdenados.sort(
        (productoA, productoB) =>
          productoB.precio - productoA.precio,
      );

    case "nombre":
      return productosOrdenados.sort(
        (productoA, productoB) =>
          productoA.nombre.localeCompare(
            productoB.nombre,
            "es",
          ),
      );

    default:
      return productosOrdenados;
  }
}