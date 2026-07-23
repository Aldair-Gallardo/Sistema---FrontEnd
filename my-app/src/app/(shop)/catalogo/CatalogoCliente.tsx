"use client";

import { useMemo, useState } from "react";
import ProductoCard from "./ProductoCard";
import {
  productos,
  type Producto,
} from "./productos";

type TipoOrden =
  | "recomendados"
  | "precio-menor"
  | "precio-mayor"
  | "nombre";

const categorias: string[] = Array.from(
  new Set(
    productos.map((producto) => producto.categoria),
  ),
);

const materiales: string[] = Array.from(
  new Set(
    productos.map((producto) => producto.material),
  ),
);

export default function CatalogoCliente() {
  const [precioMaximo, setPrecioMaximo] =
    useState<number>(500);

  const [
    categoriasSeleccionadas,
    setCategoriasSeleccionadas,
  ] = useState<string[]>([]);

  const [
    materialesSeleccionados,
    setMaterialesSeleccionados,
  ] = useState<string[]>([]);

  const [orden, setOrden] =
    useState<TipoOrden>("recomendados");

  const alternarCategoria = (categoria: string) => {
    setCategoriasSeleccionadas((categoriasActuales) => {
      if (categoriasActuales.includes(categoria)) {
        return categoriasActuales.filter(
          (categoriaActual) =>
            categoriaActual !== categoria,
        );
      }

      return [...categoriasActuales, categoria];
    });
  };

  const alternarMaterial = (material: string) => {
    setMaterialesSeleccionados((materialesActuales) => {
      if (materialesActuales.includes(material)) {
        return materialesActuales.filter(
          (materialActual) =>
            materialActual !== material,
        );
      }

      return [...materialesActuales, material];
    });
  };

  const limpiarFiltros = () => {
    setPrecioMaximo(500);
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
    precioMaximo,
    categoriasSeleccionadas,
    materialesSeleccionados,
    orden,
  ]);

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
              max={500}
              step={10}
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
              <span>$500</span>
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

                  <span>{categoria}</span>
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

                  <span>{material}</span>
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
          {/* Barra superior */}
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

          {/* Productos */}
          {productosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {productosFiltrados.map((producto) => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                />
              ))}
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