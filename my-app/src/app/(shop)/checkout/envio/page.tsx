"use client";

import { useState } from "react";
import { Button, Steps } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { DireccionesList } from "@/components/cliente/DireccionesList";

export default function CheckoutEnvioPage() {
  const { user } = useAuth();
  const { items } = useCart();
  const router = useRouter();
  const [direccionId, setDireccionId] = useState<string | undefined>();

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const envio = 0;
  const total = subtotal + envio;

  if (!user) {
    return (
      <div className="w-full bg-[#F5F1E8] min-h-screen py-20 px-6 text-center">
        <p className="text-lg text-gray-600 mb-6">Inicia sesión para continuar con tu compra.</p>
        <Link href="/login">
          <Button type="primary" style={{ background: "#6F4E37", borderColor: "#6F4E37" }}>
            Iniciar sesión
          </Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full bg-[#F5F1E8] min-h-screen py-20 px-6 text-center">
        <p className="text-lg text-gray-600 mb-6">Tu carrito está vacío.</p>
        <Link href="/catalogo">
          <Button type="primary" style={{ background: "#6F4E37", borderColor: "#6F4E37" }}>
            Explorar catálogo
          </Button>
        </Link>
      </div>
    );
  }

  function continuar() {
    if (!direccionId) return;
    router.push(`/checkout/pago?direccionId=${direccionId}`);
  }

  return (
    <div className="w-full bg-[#F5F1E8] min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Pasos de compra */}
        <Steps
          current={1}
          className="mb-10"
          items={[
            { title: "Carrito" },
            { title: "Envío" },
            { title: "Pago" },
            { title: "Confirmación" },
          ]}
        />

        <h1 className="text-4xl font-bold mb-1">Dirección de envío</h1>
        <p className="text-base text-gray-600 mb-10">
          Elige a dónde quieres recibir tu pedido
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Direcciones guardadas del usuario */}
          <div className="lg:col-span-2">
            <DireccionesList
              modoSeleccion
              mostrarTitulo={false}
              direccionSeleccionadaId={direccionId}
              onSeleccionar={(direccion) => setDireccionId(direccion.id)}
              onCargar={(direcciones) => {
                if (direccionId) return;
                const principal = direcciones.find((direccion) => direccion.principal) ?? direcciones[0];
                if (principal) setDireccionId(principal.id);
              }}
            />
          </div>

          {/* Resumen */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-4">Resumen del pedido</h2>

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

              <Button
                type="primary"
                size="large"
                block
                className="mt-6"
                disabled={!direccionId}
                onClick={continuar}
                style={{ background: "#6F4E37", borderColor: "#6F4E37" }}
              >
                Continuar con el pago
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
