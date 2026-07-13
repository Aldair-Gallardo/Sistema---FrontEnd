// src/app/providers.tsx
import { AntdProvider } from "@/lib/AntdRegistry";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AntdProvider>{children}</AntdProvider>;
}