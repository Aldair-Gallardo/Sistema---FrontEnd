"use client";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Button, Form, Input } from "antd";

export default function Login() {
  return (
    <main className="min-h-screen flex">
      {/* LADO IZQUIERDO */}
      <section className="w-1/2 bg-[#F5F0E8] flex items-center justify-center">
        <div className="w-[500px] text-center px-8">
          <h2 className="text-6xl font-bold font-serif text-[#3E2723] leading-tight">
            Bienvenido
            <br />
            de nuevo
          </h2>

          <p className="text-xl mt-8 text-gray-600 leading-relaxed">
            Inicia sesión para continuar
            <br />
            comprando tus productos favoritos.
          </p>
        </div>
      </section>

      {/* LADO DERECHO */}
      <section className="w-1/2 flex items-center justify-center">
        <div className="w-96">
          <h1 className="text-4xl font-bold font-serif mb-10">
            Iniciar sesión
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

            <Form.Item
              label="Contraseña"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Ingrese su contraseña",
                },
              ]}
            >
              <Input.Password
                placeholder="Ingrese su contraseña"
                size="large"
              />
            </Form.Item>

            <div className="text-right mb-5">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[#6F4E37] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{
                  background: "#6F4E37",
                  borderColor: "#6F4E37",
                }}
              >
                Iniciar sesión
              </Button>
            </Form.Item>
          </Form>

          <div className="flex items-center gap-3 my-8">
            <hr className="flex-1" />
            <span className="text-sm">o continúa con</span>
            <hr className="flex-1" />
          </div>

          <div className="flex gap-4">
            <Link
              href="/auth/google"
              className="border w-1/2 py-3 rounded flex items-center justify-center gap-2 hover:bg-gray-100"
            >
              <FcGoogle size={22} />
              Google
            </Link>

            <Link
              href="/auth/apple"
              className="border w-1/2 py-3 rounded flex items-center justify-center gap-2 hover:bg-gray-100"
            >
              <FaApple size={22} className="text-black" />
              Apple
            </Link>
          </div>

          <p className="text-center mt-8 text-sm">
            ¿No tienes cuenta?{" "}
            <Link
              href="/auth/register"
              className="text-[#6F4E37] font-bold hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}