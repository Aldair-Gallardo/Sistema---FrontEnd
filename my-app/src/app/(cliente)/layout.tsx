// src/app/(cliente)/layout.tsx
import { Header } from "@/components/layout/Header";
import SidebarCuenta from "@/components/layout/SidebarCuenta";

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* minHeight: 0 evita que este row se estire más allá de la altura
          disponible; sin eso el flex item de adentro (el <main>) no puede
          activar su propio scroll interno. */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <SidebarCuenta />

        <main
          style={{
            flex: 1,
            padding: "24px",
            background: "var(--color-background)",
            overflowY: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}