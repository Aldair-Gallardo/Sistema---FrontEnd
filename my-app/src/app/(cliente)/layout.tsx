// src/app/(cliente)/layout.tsx
import { Header } from "@/components/layout/Header";
import SidebarCuenta from "@/components/layout/SidebarCuenta";

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <SidebarCuenta />

        <main
          style={{
            flex: 1,
            padding: "24px",
            background: "var(--color-background)",
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
}