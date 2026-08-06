"use client";

import Link from "next/link";
import { Button, Form, Input } from "antd";

export default function ResetPassword() {
  return (
    <main className="min-h-screen flex">

      {/* Lado izquierdo */}
      <section className="w-1/2 bg-[#F5F0E8] flex items-center justify-center">
        <div className="w-[500px] text-center">

          <h2 className="text-6xl font-bold font-serif text-[#3E2723]">
            Nueva
            <br />
            contraseña
          </h2>

          <p className="text-xl mt-8 text-gray-600">
            Crea una contraseña segura para proteger tu cuenta.
          </p>

        </div>
      </section>

      {/* Lado derecho */}
      <section className="w-1/2 flex items-center justify-center">

        <div className="w-96">

          <h1 className="text-4xl font-bold font-serif mb-10">
            Restablecer contraseña
          </h1>

          <Form layout="vertical">

            <Form.Item
              label="Nueva contraseña"
              name="password"
            >
              <Input.Password
                placeholder="Nueva contraseña"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Confirmar contraseña"
              name="confirmPassword"
            >
              <Input.Password
                placeholder="Confirmar contraseña"
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
              Guardar contraseña
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