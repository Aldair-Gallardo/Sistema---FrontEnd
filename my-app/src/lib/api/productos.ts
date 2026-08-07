// src/lib/api/productos.ts
// Llamadas del panel de administrador contra /admin/products y
// /admin/uploads/images (ver teca-backend/backend/app/routers/admin.py,
// sección "Productos", y app/routers/uploads.py).

import { api, getToken } from "@/lib/api/client";
import type { Categoria, MaterialProducto, Producto, ProductoInput } from "@/types/producto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProductoBackend {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Categoria;
  material: MaterialProducto;
  color?: string;
  stock: number;
  images: string[];
  dimensions?: string;
  active: boolean;
  created_at: string;
}

function mapProducto(doc: ProductoBackend): Producto {
  return {
    id: doc.id,
    nombre: doc.name,
    descripcion: doc.description,
    precio: doc.price,
    categoria: doc.category,
    material: doc.material,
    color: doc.color,
    stock: doc.stock,
    imagenes: doc.images,
    dimensiones: doc.dimensions,
    activo: doc.active,
    creadoEn: doc.created_at,
  };
}

function mapProductoInput(input: ProductoInput | Partial<ProductoInput>) {
  return {
    name: input.nombre,
    description: input.descripcion,
    price: input.precio,
    category: input.categoria,
    material: input.material,
    color: input.color,
    stock: input.stock,
    images: input.imagenes,
    dimensions: input.dimensiones,
    active: input.activo,
  };
}

interface ListarProductosParams {
  search?: string;
  categoria?: Categoria;
  stockBajo?: boolean;
  page: number;
  pageSize: number;
}

export async function listarProductosAdmin(
  params: ListarProductosParams
): Promise<{ productos: Producto[]; total: number; totalPaginas: number }> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.categoria) query.set("category", params.categoria);
  if (params.stockBajo) query.set("low_stock", "true");
  query.set("page", String(params.page));
  query.set("page_size", String(params.pageSize));

  const respuesta = await api(`/admin/products?${query.toString()}`);
  return {
    productos: respuesta.items.map(mapProducto),
    total: respuesta.total,
    totalPaginas: respuesta.total_pages,
  };
}

/** No existe GET /admin/products/{id}; se recorre el listado (que incluye inactivos) hasta encontrar el id. */
export async function obtenerProductoAdmin(id: string): Promise<Producto | undefined> {
  let page = 1;
  while (true) {
    const { productos, totalPaginas } = await listarProductosAdmin({ page, pageSize: 50 });
    const encontrado = productos.find((producto) => producto.id === id);
    if (encontrado) return encontrado;
    if (page >= totalPaginas) return undefined;
    page += 1;
  }
}

export async function crearProducto(input: ProductoInput): Promise<Producto> {
  const doc = await api("/admin/products", {
    method: "POST",
    body: JSON.stringify(mapProductoInput(input)),
  });
  return mapProducto(doc);
}

export async function actualizarProducto(id: string, input: Partial<ProductoInput>): Promise<Producto> {
  const doc = await api(`/admin/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(mapProductoInput(input)),
  });
  return mapProducto(doc);
}

export async function eliminarProducto(id: string): Promise<void> {
  await api(`/admin/products/${id}`, { method: "DELETE" });
}

/** Sube un archivo real al backend (multipart); no pasa por api() porque esa función siempre manda JSON. */
export async function subirImagen(file: File): Promise<string> {
  if (!API_URL) {
    throw new Error("Falta configurar NEXT_PUBLIC_API_URL. Copia .env.example a .env.local con la URL del backend.");
  }

  const formData = new FormData();
  formData.append("files", file);

  const token = getToken();
  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}/admin/uploads/images`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
  } catch {
    throw new Error(`No se pudo conectar con el servidor (${API_URL}). ¿Está corriendo el backend?`);
  }

  const datos = await respuesta.json().catch(() => {
    throw new Error("El servidor respondió con un formato inesperado");
  });

  if (!respuesta.ok) {
    throw new Error(datos?.detail || "No se pudo subir la imagen");
  }

  return datos.images[0];
}

export function urlImagen(path: string): string {
  return `${API_URL}${path}`;
}
