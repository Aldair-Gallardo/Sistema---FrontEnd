"use client";

import { useState } from "react";
import Link from "next/link";
import { App, Button, Form, Input } from "antd";
import { forgotPasswordRequest } from "@/lib/api/auth";

export default function ForgotPassword() {
  const { message } = App.useApp();
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(valores: { email: string }) {
    setCargando(true);
    try {
      const respuesta = await forgotPasswordRequest(valores.email);

      message.success("Si el correo existe, recibirás las instrucciones");

      if (respuesta.reset_token) {
        console.log("Token de prueba (solo DEV_MODE):", respuesta.reset_token);
      }
    } catch (error: any) {
      message.error(error.message || "Ocurrió un error, intenta de nuevo");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="min-h-screen flex">
      <section className="w-1/2 bg-[#F5F0E8] flex items-center justify-center">
        <div className="w-[500px] text-center">
          <h2 className="text-6xl font-bold font-serif text-[#3E2723]">
            Recupera
            <br />
            tu contraseña
          </h2>
          <p className="text-xl mt-8 text-gray-600">
            Ingresa tu correo electrónico y te enviaremos
            las instrucciones para restablecer tu contraseña.
          </p>
        </div>
      </section>

      <section className="w-1/2 flex items-center justify-center">
        <div className="w-96">
          <h1 className="text-4xl font-bold font-serif mb-10">
            Recuperar contraseña
          </h1>

          <Form layout="vertical" onFinish={manejarEnvio}>
            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={[
                { required: true, message: "Ingrese su correo electrónico" },
                { type: "email", message: "Ingrese un correo válido" },
              ]}
            >
              <Input placeholder="correo@gmail.com" size="large" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={cargando}
              style={{ background: "#6F4E37", borderColor: "#6F4E37" }}
            >
              Enviar enlace
            </Button>
          </Form>

          <p className="text-center mt-6">
            <Link href="/login" className="text-[#6F4E37] hover:underline">
              Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}