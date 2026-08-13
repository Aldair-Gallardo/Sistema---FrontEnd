"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

interface CartContextType {
  items: CartItem[];
  agregarItem: (item: CartItem) => void;
  actualizarCantidad: (id: string, cantidad: number) => void;
  eliminarItem: (id: string) => void;
  vaciarCarrito: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function leerCarritoGuardado(storageKey: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const guardado = localStorage.getItem(storageKey);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

// El carrito vive por usuario: cada quien tiene su propia clave en localStorage
// (los que no han iniciado sesión comparten el "cubo" invitado). Remontar este
// componente interno con key={storageKey} cuando cambia el usuario logueado
// hace que useState relea desde cero la clave correcta, sin arrastrar items de
// otra sesión ni pisar el carrito nuevo con el viejo mientras carga.
function CartProviderInterno({ storageKey, children }: { storageKey: string; children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => leerCarritoGuardado(storageKey));

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const agregarItem = (nuevoItem: CartItem) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.id === nuevoItem.id);
      if (existente) {
        return prev.map((i) =>
          i.id === nuevoItem.id
            ? { ...i, cantidad: i.cantidad + nuevoItem.cantidad }
            : i
        );
      }
      return [...prev, nuevoItem];
    });
  };

  const actualizarCantidad = (id: string, cantidad: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  };

  const eliminarItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ items, agregarItem, actualizarCantidad, eliminarItem, vaciarCarrito, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = `teca-carrito:${user?.id ?? "invitado"}`;

  return (
    <CartProviderInterno key={storageKey} storageKey={storageKey}>
      {children}
    </CartProviderInterno>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}
