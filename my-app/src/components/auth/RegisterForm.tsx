"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useAuth } from "@/hooks/useAuth";
import { isStaffRole } from "@/lib/roles";
import { Checkbox } from 'antd';

interface RegisterValues {
  email: string;
  password: string;
}

export function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  async function handleFinish(values: RegisterValues) {
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
      <h1 className="text-4xl font-bold font-serif mb-10">Crear cuenta</h1>

      <Form layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Nombre completo"
          name="Nombre"
          rules={[{ required: true, message: "Ingresa tu nombre completo" }]}
        >
          <Input placeholder="Ingresa tu nombre completo" size="large" type="name" />
        </Form.Item>

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
          <Input.Password placeholder="Crea una contraseña" size="large" />
        </Form.Item>

        <Form.Item
          label="Confirmar contraseña"
          name="password1"
          rules={[{ required: true, message: "Confirme su contraseña" }]}
        >
          <Input.Password placeholder="Confirma tu contraseña" size="large" />
        </Form.Item>

        <div className="flex items-center gap-3 mb-5">
            <Checkbox
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
            ></Checkbox>    
            <Link
                href="/terminos-condiciones" className= "!text-xs !text-[#6F4E37] font-bold hover:!underline">
                Acepto los Términos y Condiciones y la Política de Privacidad
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
            Registrarme
          </Button>
        </Form.Item>
      </Form>

      <p className="text-center mt-8 text-sm">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-[#6F4E37] font-bold hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
