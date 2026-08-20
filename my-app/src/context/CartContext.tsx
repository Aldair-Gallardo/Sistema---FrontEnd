"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

interface CartContextType {
  items: CartItem[];
  agregarItem: (item: CartItem) => void;
  actualizarCantidad: (id: number, cantidad: number) => void;
  eliminarItem: (id: number) => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getStorageKey(userId: string | undefined) {
  return `teca-carrito-${userId ?? "invitado"}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cargado, setCargado] = useState(false);

  // Cada vez que cambia el usuario (login/logout), carga el carrito
  // correspondiente a esa cuenta (o al de invitado si no hay sesión).
  useEffect(() => {
    const key = getStorageKey(user?.id);
    const guardado = localStorage.getItem(key);
    setItems(guardado ? JSON.parse(guardado) : []);
    setCargado(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Guarda en la clave del usuario actual cada vez que cambian los items
  useEffect(() => {
    if (!cargado) return;
    const key = getStorageKey(user?.id);
    localStorage.setItem(key, JSON.stringify(items));
  }, [items, user?.id, cargado]);

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

  const actualizarCantidad = (id: number, cantidad: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  };

  const eliminarItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ items, agregarItem, actualizarCantidad, eliminarItem, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}