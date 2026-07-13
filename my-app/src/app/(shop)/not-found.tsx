// src/app/(shop)/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Página no encontrada</p>
      <p className="text-gray-500 mt-2">
        Lo sentimos, la página que buscas no existe o fue movida.
      </p>
      <Link href="/" className="inline-block mt-6 bg-header text-text-light px-6 py-2 rounded">
        Volver al inicio
      </Link>
    </div>
  );
}