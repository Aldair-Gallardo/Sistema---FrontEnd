// src/app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/LoginForm";

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
        <LoginForm />
      </section>
    </main>
  );
}
