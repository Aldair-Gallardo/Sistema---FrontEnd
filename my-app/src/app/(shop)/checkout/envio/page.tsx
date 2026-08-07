"use client";

import { useState } from "react";
import { Input, Select, Radio, Button, Steps } from "antd";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CheckoutEnvioPage() {
  const { items } = useCart();
  const [metodoEnvio, setMetodoEnvio] = useState<"misma" | "diferente">("misma");

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const envio = 0;
  const total = subtotal + envio;

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
          Completa la información para recibir el pedido
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulario */}
          <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block font-bold mb-2">Nombre completo</label>
                <Input placeholder="Ingresa tu nombre completo" size="large" />
              </div>

              <div>
                <label className="block font-bold mb-2">Teléfono</label>
                <Input placeholder="+507 6384-6732" size="large" />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold mb-2">Dirección</label>
                <Input placeholder="Calle y número de casa" size="large" className="mb-3" />
                <Input placeholder="Apartamento, suite, etc. (Opcional)" size="large" />
              </div>

              <div>
                <label className="block font-bold mb-2">Ciudad</label>
                <Input placeholder="Tu ciudad" size="large" />
              </div>

              <div>
                <label className="block font-bold mb-2">Estado / Provincia</label>
                <Select
                  placeholder="Selecciona"
                  size="large"
                  className="w-full"
                  options={[
                    { value: "panama", label: "Panamá" },
                    { value: "colon", label: "Colón" },
                    { value: "chiriqui", label: "Chiriquí" },
                  ]}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold mb-2">País</label>
                <Select
                  placeholder="Selecciona tu país"
                  size="large"
                  className="w-full"
                  defaultValue="panama"
                  options={[
                    { value: "panama", label: "Panamá" },
                    { value: "costa_rica", label: "Costa Rica" },
                    { value: "colombia", label: "Colombia" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Método de envío + resumen */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-4">Método de envío</h2>
              <Radio.Group
                className="flex flex-col gap-4"
                value={metodoEnvio}
                onChange={(e) => setMetodoEnvio(e.target.value)}
              >
                <Radio value="misma">Enviar a esta dirección</Radio>
                <Radio value="diferente">Enviar a una dirección diferente</Radio>
              </Radio.Group>
            </div>

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
                style={{ background: "#6F4E37", borderColor: "#6F4E37" }}
              >
            
            <Link href="/pago" className="text-[#6F4E37] font-bold hover:underline">
              Continuar con el pago
            </Link>
          </Button>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}