/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { urlImagen } from "@/lib/api/productos";
import {
  CATEGORIA_LABELS,
  MATERIAL_LABELS,
  type Producto,
} from "@/types/producto";

type ProductoCardProps = {
  producto: Producto;
};

export default function ProductoCard({
  producto,
}: ProductoCardProps) {
  const [cantidad, setCantidad] = useState(1);
  const { agregarItem } = useCart();

  const imagenPrincipal = producto.imagenes[0]
    ? urlImagen(producto.imagenes[0])
    : "";

  const sinStock = producto.stock <= 0;

  const disminuirCantidad = () => {
    setCantidad((cantidadActual) =>
      Math.max(1, cantidadActual - 1),
    );
  };

  const aumentarCantidad = () => {
    setCantidad((cantidadActual) =>
      Math.min(producto.stock, cantidadActual + 1),
    );
  };

  const agregarAlCarrito = () => {
    if (sinStock) {
      return;
    }

    agregarItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad,
      imagen: imagenPrincipal,
    });
  };

  
    return(

    <article className="group overflow-hidden rounded-xl border border-[#e7ddd2] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Imagen */}
      <Link
        href={`/producto/${producto.id}`}
        className="relative flex h-48 items-center justify-center overflow-hidden bg-[#f2eee8]"
      >
        {imagenPrincipal ? (
          <img
            src={imagenPrincipal}
            alt={producto.nombre}
            className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-sm text-[#756b63]">
            Producto sin imagen
          </span>
        )}
      </Link>

      {/* Información */}
      <div className="p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#966342]">
          {CATEGORIA_LABELS[producto.categoria]}
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
          Material: {MATERIAL_LABELS[producto.material]}
        </p>

        <p className="mt-1 text-xs text-[#887b72]">
          Disponibles: {producto.stock}
        </p>

        {/* Cantidad */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-[#51483f]">
            Cantidad
          </span>

          <div className="flex items-center overflow-hidden rounded-md border border-[#d8cec4]">
            <button
              type="button"
              onClick={disminuirCantidad}
              disabled={sinStock || cantidad <= 1}
              className="h-8 w-8 bg-[#f7f2e9] text-lg transition hover:bg-[#eaddce] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Disminuir cantidad de ${producto.nombre}`}
            >
              −
            </button>

            <span className="flex h-8 min-w-9 items-center justify-center border-x border-[#d8cec4] text-sm">
              {sinStock ? 0 : cantidad}
            </span>

            <button
              type="button"
              onClick={aumentarCantidad}
              disabled={sinStock || cantidad >= producto.stock}
              className="h-8 w-8 bg-[#f7f2e9] text-lg transition hover:bg-[#eaddce] disabled:cursor-not-allowed disabled:opacity-40"
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
            disabled={sinStock}
            className="min-h-10 rounded-md bg-[#795538] px-3 text-xs font-semibold text-white transition hover:bg-[#60412d] disabled:cursor-not-allowed disabled:bg-[#a99a8e]"
          >
            {sinStock ? "Sin stock" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
}