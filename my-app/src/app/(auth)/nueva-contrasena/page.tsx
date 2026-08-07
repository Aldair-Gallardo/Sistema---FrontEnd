"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Form, Input, message } from "antd";
import { resetPasswordRequest } from "@/lib/api/auth";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(valores: { password: string; confirmPassword: string }) {
    if (!token) {
      message.error("Falta el token de recuperación. Usa el enlace que te enviamos.");
      return;
    }
    if (valores.password !== valores.confirmPassword) {
      message.error("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);
    try {
      await resetPasswordRequest(token, valores.password);
      message.success("Contraseña actualizada, ya puedes iniciar sesión");
      router.push("/login");
    } catch (error: any) {
      message.error(error.message || "El enlace ya no es válido, solicita uno nuevo");
    } finally {
      setCargando(false);
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Falta el token de recuperación. Usa el enlace que te enviamos por correo.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex">
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

      <section className="w-1/2 flex items-center justify-center">
        <div className="w-96">
          <h1 className="text-4xl font-bold font-serif mb-10">
            Restablecer contraseña
          </h1>

          <Form layout="vertical" onFinish={manejarEnvio}>
            <Form.Item
              label="Nueva contraseña"
              name="password"
              rules={[
                { required: true, message: "Ingrese su nueva contraseña" },
                { min: 8, message: "Debe tener al menos 8 caracteres" },
              ]}
            >
              <Input.Password placeholder="Nueva contraseña" size="large" />
            </Form.Item>

            <Form.Item
              label="Confirmar contraseña"
              name="confirmPassword"
              rules={[{ required: true, message: "Confirme su contraseña" }]}
            >
              <Input.Password placeholder="Confirmar contraseña" size="large" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={cargando}
              style={{ background: "#6F4E37", borderColor: "#6F4E37" }}
            >
              Guardar contraseña
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


