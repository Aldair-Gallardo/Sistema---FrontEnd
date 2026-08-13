"use client";
// src/app/providers.tsx
import { AntdProvider } from "@/lib/AntdRegistry";
import { AuthProvider } from "@/hooks/AuthContext";
import { CartProvider } from "@/context/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AntdProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </AntdProvider>
  );
}
