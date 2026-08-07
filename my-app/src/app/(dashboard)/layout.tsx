// src/app/(dashboard)/layout.tsx
import { Header } from "@/components/layout/Header";
import SidebarDashboard from "@/components/layout/SidebarDashboard";

export default function DashboardLayout({
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
        <SidebarDashboard />

        <main
          style={{
            flex: 1,
            padding: "24px",
            overflowY: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}