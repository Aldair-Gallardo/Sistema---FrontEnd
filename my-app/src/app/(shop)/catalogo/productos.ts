export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  material: string;
  categoria: string;
  imagen: string;
  destacado: boolean;
};

export const productos: Producto[] = [
  // Los mismos productos destacados de la página de inicio
  {
    id: 1,
    nombre: "Sofá moderno de sala",
    precio: 299.99,
    material: "Tela y madera",
    categoria: "Sofás",
    imagen: "/images/inicio/sofa.png",
    destacado: true,
  },
  {
    id: 2,
    nombre: "Mesa de comedor",
    precio: 199.99,
    material: "Madera natural",
    categoria: "Mesas",
    imagen: "/images/inicio/mesa.png",
    destacado: true,
  },
  {
    id: 3,
    nombre: "Silla moderna",
    precio: 49.99,
    material: "Madera y tela",
    categoria: "Sillas",
    imagen: "/images/inicio/silla.png",
    destacado: true,
  },
  {
    id: 4,
    nombre: "Lámpara de pie",
    precio: 59.99,
    material: "Metal y tela",
    categoria: "Lámparas",
    imagen: "/images/inicio/lampara.png",
    destacado: true,
  },

  // Productos adicionales del catálogo
  {
    id: 5,
    nombre: "Mesa auxiliar",
    precio: 129.99,
    material: "Madera natural",
    categoria: "Mesas",
    imagen: "/images/catalogo/mesa-auxiliar.png",
    destacado: false,
  },
  {
    id: 6,
    nombre: "Sofá de tres puestos",
    precio: 399.99,
    material: "Tela y madera",
    categoria: "Sofás",
    imagen: "/images/catalogo/sofa-tres-puestos.png",
    destacado: false,
  },
  {
    id: 7,
    nombre: "Silla tapizada",
    precio: 89.99,
    material: "Tela y madera",
    categoria: "Sillas",
    imagen: "/images/catalogo/silla-tapizada.png",
    destacado: false,
  },
  {
    id: 8,
    nombre: "Lámpara de mesa",
    precio: 69.99,
    material: "Metal y tela",
    categoria: "Lámparas",
    imagen: "/images/catalogo/lampara-mesa.png",
    destacado: false,
  },
];