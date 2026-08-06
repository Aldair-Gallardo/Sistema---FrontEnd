// src/types/producto.ts
// Tipos del panel de administrador de productos. Calzan 1:1 con lo que
// devuelve la API real (ver teca-backend/backend/app/models.py, ProductIn/
// ProductUpdateIn, y app/routers/admin.py, sección "Productos").

export type Categoria = "sofa" | "silla" | "mesa" | "cama" | "lampara" | "espejo";

export const CATEGORIA_LABELS: Record<Categoria, string> = {
  sofa: "Sofá",
  silla: "Silla",
  mesa: "Mesa",
  cama: "Cama",
  lampara: "Lámpara",
  espejo: "Espejo",
};

export type MaterialProducto = "madera" | "tela" | "metal" | "vidrio";

export const MATERIAL_LABELS: Record<MaterialProducto, string> = {
  madera: "Madera",
  tela: "Tela",
  metal: "Metal",
  vidrio: "Vidrio",
};

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: Categoria;
  material: MaterialProducto;
  color?: string;
  stock: number;
  imagenes: string[];
  dimensiones?: string;
  activo: boolean;
  creadoEn: string;
}

/** Lo que envían los formularios de crear/editar producto. */
export interface ProductoInput {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: Categoria;
  material: MaterialProducto;
  color?: string;
  stock: number;
  imagenes: string[];
  dimensiones?: string;
  activo: boolean;
}

/** Igual al umbral fijo que usa el propio backend (admin.py: stock < 5) para el filtro y el dashboard. */
export const STOCK_BAJO_UMBRAL = 5;
