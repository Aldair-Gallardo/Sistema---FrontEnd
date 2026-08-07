"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "teca-carrito";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cargado, setCargado] = useState(false);

  // Cargar del localStorage al montar
  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      setItems(JSON.parse(guardado));
    }
    setCargado(true);
  }, []);

  // Guardar cada vez que cambien los items (solo después de cargar)
  useEffect(() => {
    if (cargado) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, cargado]);

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