// src/app/(cliente)/devoluciones/nueva/page.tsx
import { Suspense } from "react";
import { Spin } from "antd";
import { NuevaDevolucionForm } from "@/components/cliente/NuevaDevolucionForm";

export default function NuevaDevolucionPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spin />
        </div>
      }
    >
      <NuevaDevolucionForm />
    </Suspense>
  );
}
