// src/components/layout/Header.tsx
'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Input } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { isStaffRole } from "@/lib/roles";
import { Badge } from "antd";
import { useCart } from "@/context/CartContext";


const { Search } = Input;

const menuItems = [
  { key: "inicio", label: <Link href="/">INICIO</Link> },
  { key: "catalogo", label: <Link href="/catalogo">CATÁLOGO</Link> },
  { key: "nosotros", label: <Link href="/nosotros">NOSOTROS</Link> },
  { key: "ofertas", label: <Link href="/ofertas">OFERTAS</Link> },
  { key: "contacto", label: <Link href="/contacto">CONTACTO</Link> },
];

export function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const { totalItems } = useCart();

  const hayUsuarioLogueado = !!user;
  const esUsuarioInterno = isStaffRole(user?.role);

  const handleSearch = (value: string) => {
    const query = value.trim();
    if (query) {
      router.push(`/buscar?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="w-full bg-header px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="!text-text-light text-2xl font-bold no-underline">
        TECA
      </Link>

    

      <Menu
        mode="horizontal"
        items={menuItems}
        style={{
          flex: 1,
          justifyContent: "center",
          background: "transparent",
          borderBottom: "none",
        }}
        className="[&_a]:!text-white [&_.ant-menu-item]:!text-white"
      />

      <div className="flex items-center gap-6">
        <Search
          placeholder="Search"
          onSearch={handleSearch}
          style={{ width: 200 }}
        />

        {esUsuarioInterno && (
          <Link
            href="/panel"
            className="!text-text-light text-sm font-semibold no-underline"
          >
            Administrador
          </Link>
        )}

        {hayUsuarioLogueado ? (
          <Link href="/mi-cuenta">
            <UserOutlined className="!text-text-light text-xl cursor-pointer" />
          </Link>
        ) : (
          <Link
            href="/login"
            className="!text-text-light text-sm font-semibold no-underline"
          >
            Iniciar sesión
          </Link>
        )}

        <Link href="/carrito">
  
        <Badge count={totalItems} size="small" offset={[-2, 2]}>
          <ShoppingCartOutlined className="text-text-light text-xl cursor-pointer" />
        </Badge>
         </Link>
      </div>
    </header>
  );
}