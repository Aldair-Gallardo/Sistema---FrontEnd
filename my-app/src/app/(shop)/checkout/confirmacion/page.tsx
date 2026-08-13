"use client";

import { useEffect, useState } from "react";
import { App, Button, Spin, Steps } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { listarDirecciones } from "@/lib/api/direcciones";
import { listarMetodosPago } from "@/lib/api/cliente";
import { crearPedido } from "@/lib/api/pedidos";
import type { Direccion, MetodoPago } from "@/types/cliente";

export default function CheckoutConfirmacionPage() {
  const { user } = useAuth();
  const { items, vaciarCarrito } = useCart();
  const router = useRouter();
  const { message } = App.useApp();
  const searchParams = useSearchParams();
  const direccionId = searchParams.get("direccionId");
  const metodoPagoId = searchParams.get("metodoPagoId");

  const [direccion, setDireccion] = useState<Direccion | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);
  const [cargando, setCargando] = useState(true);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargarResumen = async () => {
      if (!user || !direccionId || !metodoPagoId) {
        if (activo) setCargando(false);
        return;
      }
      try {
        const [direcciones, metodos] = await Promise.all([listarDirecciones(), listarMetodosPago()]);
        if (!activo) return;
        setDireccion(direcciones.find((d) => d.id === direccionId) ?? null);
        setMetodoPago(metodos.find((m) => m.id === metodoPagoId) ?? null);
      } catch (error) {
        if (activo) message.error(error instanceof Error ? error.message : "No se pudo cargar el resumen");
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarResumen();

    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, direccionId, metodoPagoId]);

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const envio = 0;
  const total = subtotal + envio;

  const pasos = (
    <Steps
      current={3}
      className="mb-10"
      items={[{ title: "Carrito" }, { title: "Envío" }, { title: "Pago" }, { title: "Confirmación" }]}
    />
  );

  async function handleConfirmar() {
    if (!user || !direccion || !metodoPago) return;
    setConfirmando(true);
    try {
      const pedido = await crearPedido({
        email: user.email,
        items: items.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
        direccion: {
          nombreCompleto: direccion.nombreCompleto,
          telefono: direccion.telefono,
          provincia: direccion.provincia,
          ciudad: direccion.ciudad,
          calle: direccion.calle,
          referencia: direccion.referencia,
        },
        metodoPago: metodoPago.tipo,
      });
      vaciarCarrito();
      message.success("¡Pedido confirmado!");
      router.push(`/mis-pedidos/${pedido.id}`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "No se pudo confirmar el pedido");
      setConfirmando(false);
    }
  }

  if (!user) {
    return (
      <div className="w-full bg-[#F5F1E8] min-h-screen py-20 px-6 text-center">
        <p className="text-lg text-gray-600 mb-6">Inicia sesión para confirmar tu pedido.</p>
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

  if (!direccionId || !metodoPagoId) {
    return (
      <div className="w-full bg-[#F5F1E8] min-h-screen py-20 px-6 text-center">
        <p className="text-lg text-gray-600 mb-6">Primero elige dirección y método de pago.</p>
        <Link href="/checkout/envio">
          <Button type="primary" style={{ background: "#6F4E37", borderColor: "#6F4E37" }}>
            Volver a envío
          </Button>
        </Link>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="w-full bg-[#F5F1E8] min-h-screen py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {pasos}
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  }

  if (!direccion || !metodoPago) {
    return (
      <div className="w-full bg-[#F5F1E8] min-h-screen py-20 px-6 text-center">
        <p className="text-lg text-gray-600 mb-6">
          No encontramos la dirección o el método de pago elegidos. Vuelve a intentarlo.
        </p>
        <Link href="/checkout/envio">
          <Button type="primary" style={{ background: "#6F4E37", borderColor: "#6F4E37" }}>
            Volver a envío
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F5F1E8] min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {pasos}

        <h1 className="text-4xl font-bold mb-1">Confirma tu pedido</h1>
        <p className="text-base text-gray-600 mb-10">Revisa los datos antes de confirmar</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-3">Dirección de envío</h2>
              <p className="font-semibold">{direccion.nombreCompleto}</p>
              <p className="text-gray-600 text-sm">
                {direccion.calle}, {direccion.ciudad}, {direccion.provincia}
                {direccion.referencia && ` — ${direccion.referencia}`}
              </p>
              <p className="text-gray-600 text-sm">{direccion.telefono}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-3">Método de pago</h2>
              <p className="font-semibold">{metodoPago.etiqueta}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-3">Productos</h2>
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span>
                      {item.nombre} × {item.cantidad}
                    </span>
                    <span className="font-semibold">${(item.precio * item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
                loading={confirmando}
                onClick={handleConfirmar}
                style={{ background: "#6F4E37", borderColor: "#6F4E37" }}
              >
                Confirmar pedido
              </Button>

              <Link href="/checkout/pago" className="mt-3 block text-center text-sm text-[#6F4E37] hover:underline">
                Volver a pago
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
