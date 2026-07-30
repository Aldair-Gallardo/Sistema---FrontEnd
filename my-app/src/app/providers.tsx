// src/app/providers.tsx
import { AntdProvider } from "@/lib/AntdRegistry";
import { AuthProvider } from "@/hooks/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AntdProvider>
      <AuthProvider>{children}</AuthProvider>
    </AntdProvider>
  );
}