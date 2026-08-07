import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <main className="min-h-screen flex">
      {/* LADO IZQUIERDO */}
      <section className="w-1/2 bg-[#F5F0E8] flex items-center justify-center">
        <div className="w-[500px] text-center px-8">
          <h2 className="text-6xl  font-serif text-[#3E2723] leading-tight">
            Crea tu cuenta
            </h2>

          <p className="text-xl mt-8 text-gray-600 leading-relaxed">
            Únete a nosotros y disfruta 
            <br />
            de una mejor experiencia
          </p>
        </div>
      </section>

      {/* LADO DERECHO */}
      <section className="w-1/2 flex items-center justify-center">
        <RegisterForm/>
      </section>
    </main>
  );
}