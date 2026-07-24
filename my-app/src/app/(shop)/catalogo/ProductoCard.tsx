"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Producto } from "./productos";

type ProductoCardProps = {
  producto: Producto;
};

export default function ProductoCard({
  producto,
}: ProductoCardProps) {
  const [cantidad, setCantidad] = useState<number>(1);

  const disminuirCantidad = () => {
    setCantidad((cantidadActual) =>
      Math.max(1, cantidadActual - 1),
    );
  };

  const aumentarCantidad = () => {
    setCantidad((cantidadActual) => cantidadActual + 1);
  };

  const agregarAlCarrito = () => {
    window.alert(
      `${cantidad} unidad(es) de ${producto.nombre} agregada(s) al carrito.`,
    );
  };

  return (
    <article className="group overflow-hidden rounded-xl border border-[#e7ddd2] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Imagen del producto */}
      <Link
        href={`/producto/${producto.id}`}
        className="relative block h-48 overflow-hidden bg-[#f2eee8]"
      >
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-5 transition duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Información */}
      <div className="p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#966342]">
          {producto.categoria}
        </p>

        <Link href={`/producto/${producto.id}`}>
          <h2 className="min-h-12 text-base font-semibold text-[#302821] transition hover:text-[#795538]">
            {producto.nombre}
          </h2>
        </Link>

        <p className="mt-1 text-lg font-bold text-[#795538]">
          ${producto.precio.toFixed(2)}
        </p>

        <p className="mt-1 text-sm text-[#756b63]">
          Material: {producto.material}
        </p>

        {/* Selector de cantidad */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-[#51483f]">
            Cantidad
          </span>

          <div className="flex items-center overflow-hidden rounded-md border border-[#d8cec4]">
            <button
              type="button"
              onClick={disminuirCantidad}
              className="h-8 w-8 bg-[#f7f2e9] text-lg transition hover:bg-[#eaddce]"
              aria-label={`Disminuir cantidad de ${producto.nombre}`}
            >
              −
            </button>

            <span className="flex h-8 min-w-9 items-center justify-center border-x border-[#d8cec4] text-sm">
              {cantidad}
            </span>

            <button
              type="button"
              onClick={aumentarCantidad}
              className="h-8 w-8 bg-[#f7f2e9] text-lg transition hover:bg-[#eaddce]"
              aria-label={`Aumentar cantidad de ${producto.nombre}`}
            >
              +
            </button>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/producto/${producto.id}`}
            className="flex min-h-10 items-center justify-center rounded-md border border-[#795538] px-3 text-center text-xs font-semibold text-[#795538] transition hover:bg-[#f3e8dc]"
          >
            Ver detalle
          </Link>

          <button
            type="button"
            onClick={agregarAlCarrito}
            className="min-h-10 rounded-md bg-[#795538] px-3 text-xs font-semibold text-white transition hover:bg-[#60412d]"
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}