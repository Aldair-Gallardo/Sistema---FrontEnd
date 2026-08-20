"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useAuth } from "@/hooks/useAuth";
import { isStaffRole } from "@/lib/roles";
import { Checkbox } from 'antd';
import { App } from "antd";

interface RegisterValues {
  nombre: string;
  email: string;
  password: string;
  confirmarPassword: string;
}

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [form] = Form.useForm<RegisterValues>();
  const { message } = App.useApp();

 async function handleFinish(values: RegisterValues) {
  setLoading(true);
  try {
    await register(values.nombre, values.email, values.password);
    message.success("Cuenta creada. Revisa tu correo para verificarla.");
    router.push("/verificar-correo");
  } catch (error) {
    message.error(
      error instanceof Error ? error.message : "Ocurrió un error inesperado"
    );
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
          name="nombre"
          rules={[{ required: true, message: "Ingresa tu nombre completo" }]}
        >
          <Input placeholder="Ingresa tu nombre completo" size="large" type="name" />
        </Form.Item>

        <Form.Item
          label="Correo electrónico"
          name="email"
          rules={[{ required: true, message: "Ingrese su correo electrónico" }, { type: "email", message: "Ingresa un correo electrónico válido"},]}
        >
          <Input placeholder="correo@gmail.com" size="large" type="email" />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: "Ingrese su contraseña" }, { min: 6, message: "La contraseña debe tener al menos 6 caracteres" },]}
          hasFeedback
        >
          <Input.Password placeholder="Crea una contraseña" size="large" />
        </Form.Item>

        <Form.Item
          label="Confirmar contraseña"
          name="confirmarpassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
          { required: true, message: "Confirma tu contraseña" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  "Las contraseñas no coinciden, ingrese nuevamente la contraseña"
                )
              );
            },
          }),
        ]}
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
            disabled={!aceptaTerminos}
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
