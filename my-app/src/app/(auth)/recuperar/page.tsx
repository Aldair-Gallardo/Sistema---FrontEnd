"use client";

import Link from "next/link";
import { Button, Form, Input } from "antd";

export default function ForgotPassword() {
  return (
    <main className="min-h-screen flex">

      {/* Lado izquierdo */}
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

      {/* Lado derecho */}
      <section className="w-1/2 flex items-center justify-center">
        <div className="w-96">

          <h1 className="text-4xl font-bold font-serif mb-10">
            Recuperar contraseña
          </h1>

          <Form layout="vertical">

            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Ingrese su correo electrónico",
                },
              ]}
            >
              <Input
                placeholder="correo@gmail.com"
                size="large"
              />
            </Form.Item>

            <Button
              type="primary"
              block
              size="large"
              style={{
                background: "#6F4E37",
                borderColor: "#6F4E37",
              }}
            >
              Enviar enlace
            </Button>

          </Form>

          <p className="text-center mt-6">
            <Link
              href="/auth/login"
              className="text-[#6F4E37] hover:underline"
            >
              Volver al inicio de sesión
            </Link>
          </p>

        </div>
      </section>

    </main>
  );
}