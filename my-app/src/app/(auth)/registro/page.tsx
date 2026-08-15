"use client";

import { useState } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { RegisterSuccess } from "@/components/auth/RegisterSuccess";

interface RegisteredUser {
  name: string;
  email: string;
  token?: string;
}

export default function Register() {
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);

  const handleRegisterSuccess = (name: string, email: string, token?: string) => {
    setRegisteredUser({ name, email, token });
  };

  if (registeredUser) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-[#F5F1E8] flex items-center justify-center py-12">
        <RegisterSuccess
          name={registeredUser.name}
          email={registeredUser.email}
          verificationToken={registeredUser.token}
        />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-72px)] flex bg-[#F5F1E8]">
      {/* LADO IZQUIERDO: Imagen acogedora */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden min-h-[calc(100vh-72px)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/inicio/sala-principal.jpg"
          alt="Decoración acogedora TECA"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Filtro cálido sobre la imagen */}
        <div className="absolute inset-0 bg-[#6F4E37]/5 mix-blend-multiply" />
      </section>

      {/* LADO DERECHO: Formulario de Registro */}
      <section className="w-full lg:w-1/2 flex items-center justify-center py-12 bg-white">
        <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
      </section>
    </main>
  );
}