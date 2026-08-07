"use client";
// src/app/providers.tsx
import { ConfigProvider } from "antd";
import { AuthProvider } from "@/hooks/AuthContext";
import { CartProvider } from "@/context/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorLink: "#6F4E37",
          colorLinkHover: "#6F4E37",
          colorLinkActive: "#6F4E37",
        },
      }}
    >
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}