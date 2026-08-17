"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, Card, Space, message } from "antd";
import {
  CheckCircleFilled,
  FacebookFilled,
  InstagramOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { verifyEmailRequest } from "@/lib/api/auth";

interface RegisterSuccessProps {
  name: string;
  email: string;
  verificationToken?: string;
}

export function RegisterSuccess({ name, email, verificationToken }: RegisterSuccessProps) {
  useEffect(() => {
    // Verificación automática en segundo plano (sólo si hay token)
    if (verificationToken) {
      verifyEmailRequest(verificationToken)
        .then(() => {
          console.log("Correo verificado automáticamente en segundo plano.");
        })
        .catch((err) => {
          console.error("Error al verificar correo automáticamente:", err);
        });
    }
  }, [verificationToken]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Tarjeta de Registro Exitoso y Bienvenida */}
      <Card className="w-full shadow-md border border-[#E6DFDB] rounded-xl overflow-hidden bg-white">
        <div className="text-center p-6 border-b border-[#FAF8F5] bg-[#FAF8F5]">
          <CheckCircleFilled className="text-5xl text-[#2E7D32] mb-3 animate-bounce" />
          <h1 className="text-2xl font-bold font-serif text-[#3E2723]">
            ¡Cuenta creada con éxito!
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Se ha registrado tu cuenta con el correo <strong className="text-gray-700">{email}</strong>
          </p>
          {verificationToken && (
            <span className="inline-block mt-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-semibold border border-green-200">
              ✓ Correo verificado automáticamente (Dev Mode)
            </span>
          )}
        </div>

        {/* Contenido del correo de bienvenida */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
            <div className="flex-1 text-left">
              <h2 className="text-xl font-bold text-gray-800 mb-3 font-serif">
                ¡Bienvenido a TECA, {name}! 👋
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed mb-5">
                Gracias por crear tu cuenta. Estamos felices de tenerte con nosotros. En TECA nos esforzamos por ofrecerte la mejor experiencia en cada compra.
              </p>
              <Link href="/catalogo" passHref>
                <Button
                  type="primary"
                  size="large"
                  className="h-11 px-8 text-xs font-semibold rounded-md !bg-[#6F4E37] !border-[#6F4E37] hover:!bg-[#5A3E2B] hover:!border-[#5A3E2B]"
                >
                  Explorar catálogo
                </Button>
              </Link>
            </div>
            <div className="w-full md:w-[200px] h-[130px] relative rounded-lg overflow-hidden border border-gray-100 bg-[#FAF8F5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/inicio/sala-principal.jpg"
                alt="Sala principal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h3 className="text-center font-bold text-gray-800 mb-4 text-xs tracking-wide">
            Disfruta de todos los beneficios de tu cuenta
          </h3>

          {/* Beneficios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            <div className="border border-gray-100 bg-[#FAF8F5] rounded-lg p-3.5 text-center">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center mx-auto mb-2.5 shadow-xs border border-gray-100 text-sm">
                📦
              </div>
              <h4 className="font-bold text-gray-800 text-[11px] mb-1">Seguimiento de pedidos</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Rastrea el estado de tus pedidos en tiempo real.
              </p>
            </div>
            <div className="border border-gray-100 bg-[#FAF8F5] rounded-lg p-3.5 text-center">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center mx-auto mb-2.5 shadow-xs border border-gray-100 text-sm">
                📋
              </div>
              <h4 className="font-bold text-gray-800 text-[11px] mb-1">Historial de compras</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Consulta fácilmente tus compras anteriores y vuelve a comprar.
              </p>
            </div>
            <div className="border border-gray-100 bg-[#FAF8F5] rounded-lg p-3.5 text-center">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center mx-auto mb-2.5 shadow-xs border border-gray-100 text-sm">
                🔄
              </div>
              <h4 className="font-bold text-gray-800 text-[11px] mb-1">Devoluciones fáciles</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Solicita devoluciones de forma rápida y sin complicaciones.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 pt-5 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] text-gray-400">
            <span>¿Necesitas ayuda? <span className="underline cursor-pointer">Contáctanos</span></span>
            <Space size="middle" className="text-gray-500">
              <FacebookFilled className="cursor-pointer hover:text-[#6F4E37]" />
              <InstagramOutlined className="cursor-pointer hover:text-[#6F4E37]" />
              <TwitterOutlined className="cursor-pointer hover:text-[#6F4E37]" />
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
}
