// src/app/(shop)/carrito/page.tsx
"use client";

import { InputNumber, Button } from "antd";
import { DeleteOutlined, TruckOutlined, SafetyOutlined, SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CarritoPage() {
  const { items, actualizarCantidad, eliminarItem } = useCart();

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const envio = 0;
  const total = subtotal + envio;

 if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Mi carrito</h1>
        <p className="text-gray-500 mb-6">Tu carrito está vacío.</p>
        <Link href="/catalogo">
          <Button type="primary" style={{ background: "#6F4E37", borderColor: "#6F4E37" }}>
            Ver catálogo
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Mi carrito</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Tabla de productos */}
        <div className="flex-1">
          <div className="grid grid-cols-4 text-sm font-semibold text-gray-600 pb-3 border-b">
            <span>Producto</span>
            <span>Precio</span>
            <span>Cantidad</span>
            <span>Subtotal</span>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-4 items-center py-5 border-b"
            >
              <div className="flex flex-col items-center gap-2">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-60 h-40 object-cover bg-gray-100 rounded-lg"
                />
                 <span className="text-sm font-medium">{item.nombre}</span>
              </div>
              <span>${item.precio.toFixed(2)}</span>

              <InputNumber
                min={1}
                value={item.cantidad}
                onChange={(value) => actualizarCantidad(item.id, value || 1)}
                className="w-20"
              />

              <div className="flex items-center justify-between pr-4">
                <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                <button
                  onClick={() => eliminarItem(item.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <DeleteOutlined />
                </button>
              </div>
            </div>
          ))}

          <Link href="/catalogo">
            <div className="mt-5 border border-gray-300 rounded px-4 py-2 w-fit text-gray-500 cursor-pointer hover:border-[#6F4E37] hover:text-[#6F4E37] transition-colors">
              Seguir comprando
            </div>
          </Link>
        </div>

        {/* Resumen del pedido */}
        <div className="w-full lg:w-80">
          <div className="bg-[#F5F1E8] rounded-lg p-6">
            <h2 className="font-semibold mb-4">Resumen del pedido</h2>

            <div className="flex justify-between text-sm mb-3">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm pb-3 border-b">
              <span>Envío</span>
              <span>${envio.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            block
            className="mt-4"
            style={{ background: "#6F4E37", borderColor: "#6F4E37" }}
          >
            <Link href="/checkout/envio" className="text-[#6F4E37] font-bold hover:underline">
              Continuar con el envío
            </Link>
          </Button>

          <div className="grid grid-cols-3 gap-2 mt-6 text-center text-xs text-[#6F4E37]">
            <div className="flex flex-col items-center gap-1">
              <TruckOutlined style={{ fontSize: 20 }} />
              <span>Envíos rápidos a todo el país</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <SafetyOutlined style={{ fontSize: 20 }} />
              <span>Pagos seguros y protegidos</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <SyncOutlined style={{ fontSize: 20 }} />
              <span>Cambios y devoluciones fáciles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}