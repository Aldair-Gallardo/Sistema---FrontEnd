// src/components/auth/LoginForm.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Button, Form, Input, message } from "antd";
import { useAuth } from "@/hooks/useAuth";
import { isStaffRole } from "@/lib/roles";

interface LoginValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleFinish(values: LoginValues) {
    setLoading(true);
    try {
      const user = await login(values.email, values.password);
      router.push(isStaffRole(user.role) ? "/panel" : "/");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-96">
      <h1 className="text-4xl font-bold font-serif mb-10">Iniciar sesión</h1>

      <Form layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Correo electrónico"
          name="email"
          rules={[{ required: true, message: "Ingrese su correo electrónico" }]}
        >
          <Input placeholder="correo@gmail.com" size="large" type="email" />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: "Ingrese su contraseña" }]}
        >
          <Input.Password placeholder="Ingrese su contraseña" size="large" />
        </Form.Item>

        <div className="text-right mb-5">
          <Link href="/recuperar" className="text-xs text-[#6F4E37] hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{ background: "#6F4E37", borderColor: "#6F4E37" }}
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
        <Link href="/registro" className="text-[#6F4E37] font-bold hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
