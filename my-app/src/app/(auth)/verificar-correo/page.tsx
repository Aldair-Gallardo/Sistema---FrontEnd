"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Button, Spin } from "antd";
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { verifyEmailRequest } from "@/lib/api/auth";

function VerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("Falta el token de verificación en la URL.");
      return;
    }

    let isMounted = true;

    async function verifyToken() {
      try {
        await verifyEmailRequest(token as string);
        if (isMounted) {
          setStatus("success");
        }
      } catch (err) {
        if (isMounted) {
          setStatus("error");
          setErrorMsg(err instanceof Error ? err.message : "Ocurrió un error al verificar tu correo.");
        }
      }
    }

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const antIcon = <LoadingOutlined style={{ fontSize: 48, color: "#6F4E37" }} spin />;

  return (
    <div className="w-full max-w-md bg-white shadow-sm border border-gray-100 rounded-xl p-8 md:p-12 text-center flex flex-col items-center">
      {status === "loading" && (
        <div className="py-8">
          <Spin indicator={antIcon} />
          <h2 className="text-xl font-bold font-serif text-[#3E2723] mt-8 mb-2">
            Verificando tu cuenta
          </h2>
          <p className="text-sm text-gray-500">
            Espera un momento mientras activamos tu cuenta...
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="animate-fade-in flex flex-col items-center">
          <CheckCircleFilled className="text-6xl text-[#2E7D32] mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#3E2723] mb-4">
            ¡Correo verificado!
          </h2>
          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            Tu dirección de correo electrónico ha sido confirmada con éxito. Ya puedes iniciar sesión y comenzar a explorar nuestro catálogo de muebles exclusivos.
          </p>
          <Link href="/login" passHref className="w-full">
            <Button
              type="primary"
              size="large"
              block
              className="h-12 text-sm font-semibold rounded-md !bg-[#6F4E37] !border-[#6F4E37] hover:!bg-[#5A3E2B] hover:!border-[#5A3E2B]"
            >
              Iniciar sesión
            </Button>
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="animate-fade-in flex flex-col items-center">
          <CloseCircleFilled className="text-6xl text-[#C62828] mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#3E2723] mb-4">
            Fallo de verificación
          </h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {errorMsg}
          </p>
          <p className="text-xs text-gray-400 mb-8 leading-relaxed">
            Los enlaces de verificación expiran en 24 horas. Por favor, asegúrate de que el enlace sea correcto.
          </p>
          <div className="flex gap-4 w-full">
            <Link href="/registro" passHref className="flex-1">
              <Button
                size="large"
                block
                className="h-12 text-sm font-semibold rounded-md border-[#6F4E37] text-[#6F4E37] hover:!text-[#5A3E2B] hover:!border-[#5A3E2B]"
              >
                Registrarse
              </Button>
            </Link>
            <Link href="/" passHref className="flex-1">
              <Button
                type="primary"
                size="large"
                block
                className="h-12 text-sm font-semibold rounded-md !bg-[#6F4E37] !border-[#6F4E37] hover:!bg-[#5A3E2B] hover:!border-[#5A3E2B]"
              >
                Ir al inicio
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#F5F1E8] flex items-center justify-center py-12 px-4">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white shadow-sm border border-gray-100 rounded-xl p-12 text-center flex flex-col items-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: "#6F4E37" }} spin />} />
          <h2 className="text-xl font-bold font-serif text-[#3E2723] mt-8">Cargando...</h2>
        </div>
      }>
        <VerificationContent />
      </Suspense>
    </main>
  );
}
