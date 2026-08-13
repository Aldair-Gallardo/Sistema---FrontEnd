"use client";

import { useState } from "react";
import { Button, Steps } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { MetodosPagoList } from "@/components/cliente/MetodosPagoList";

export default function CheckoutPagoPage() {
  const { user } = useAuth();
  const { items } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const direccionId = searchParams.get("direccionId");
  const [metodoPagoId, setMetodoPagoId] = useState<string | undefined>();

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

  if (!direccionId) {
    return (
      <div className="w-full bg-[#F5F1E8] min-h-screen py-20 px-6 text-center">
        <p className="text-lg text-gray-600 mb-6">Primero elige una dirección de envío.</p>
        <Link href="/checkout/envio">
          <Button type="primary" style={{ background: "#6F4E37", borderColor: "#6F4E37" }}>
            Volver a envío
          </Button>
        </Link>
      </div>
    );
  }

  function continuar() {
    if (!metodoPagoId) return;
    router.push(`/checkout/confirmacion?direccionId=${direccionId}&metodoPagoId=${metodoPagoId}`);
  }

  return (
    <div className="w-full bg-[#F5F1E8] min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Pasos de compra */}
        <Steps
          current={2}
          className="mb-10"
          items={[
            { title: "Carrito" },
            { title: "Envío" },
            { title: "Pago" },
            { title: "Confirmación" },
          ]}
        />

        <h1 className="text-4xl font-bold mb-1">Método de pago</h1>
        <p className="text-base text-gray-600 mb-10">
          Elige con qué quieres pagar tu pedido
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Métodos de pago guardados del usuario */}
          <div className="lg:col-span-2">
            <MetodosPagoList
              modoSeleccion
              mostrarTitulo={false}
              metodoSeleccionadoId={metodoPagoId}
              onSeleccionar={(metodo) => setMetodoPagoId(metodo.id)}
              onCargar={(metodos) => {
                if (metodoPagoId) return;
                const principal = metodos.find((metodo) => metodo.principal) ?? metodos[0];
                if (principal) setMetodoPagoId(principal.id);
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
                disabled={!metodoPagoId}
                onClick={continuar}
                style={{ background: "#6F4E37", borderColor: "#6F4E37" }}
              >
                Continuar
              </Button>

              <Link href="/checkout/envio" className="mt-3 block text-center text-sm text-[#6F4E37] hover:underline">
                Volver a envío
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
