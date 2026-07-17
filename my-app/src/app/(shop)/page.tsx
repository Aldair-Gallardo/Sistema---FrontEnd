import Image from "next/image";
import Link from "next/link";

const productosDestacados = [
  {
    id: 1,
    nombre: "Sofá moderno de sala",
    precio: 299.99,
    material: "Tela y madera",
    imagen: "/images/inicio/sofa.png",
  },
  {
    id: 2,
    nombre: "Mesa de comedor",
    precio: 199.99,
    material: "Madera natural",
    imagen: "/images/inicio/mesa.png",
  },
  {
    id: 3,
    nombre: "Silla moderna",
    precio: 49.99,
    material: "Madera y tela",
    imagen: "/images/inicio/silla.png",
  },
  {
    id: 4,
    nombre: "Lámpara de pie",
    precio: 59.99,
    material: "Metal y tela",
    imagen: "/images/inicio/lampara.png",
  },
];

export default function InicioPage() {
  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#302821]">
      {/* Presentación principal */}
      <section className="mx-auto grid w-[calc(100%-40px)] max-w-6xl items-center gap-10 py-12 md:grid-cols-[38%_62%]">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[2px] text-[#966342]">
            Diseño, comodidad y calidad
          </p>

          <h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            Muebles de calidad
            <br />
            para toda la vida
          </h1>

          <p className="my-6 max-w-sm leading-7 text-[#766b63]">
            Diseños duraderos que transforman cualquier espacio en un hogar
            cómodo, elegante y funcional.
          </p>

          <Link
            href="/catalogo"
            className="inline-flex rounded bg-[#795538] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#60412d]"
          >
            Ver catálogo
          </Link>
        </div>

        <div className="relative h-[280px] overflow-hidden rounded-md bg-[#e5ddd2] shadow-lg sm:h-[360px]">
          <Image
            src="/images/inicio/sala-principal.jpg"
            alt="Sala moderna con muebles TECA"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 62vw"
          />

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#795538]" />
            <span className="h-2.5 w-2.5 rounded-full border border-white bg-white/70" />
            <span className="h-2.5 w-2.5 rounded-full border border-white bg-white/70" />
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="mx-auto w-[calc(100%-40px)] max-w-6xl pb-20">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[2px] text-[#966342]">
              Nuestra selección
            </p>

            <h2 className="text-2xl font-semibold">Productos destacados</h2>
          </div>

          <Link
            href="/catalogo"
            className="flex items-center gap-2 text-sm font-medium text-[#5c4d43] hover:text-[#795538]"
          >
            Ver todos los productos
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {productosDestacados.map((producto) => (
            <article
              key={producto.id}
              className="group overflow-hidden rounded-md border border-[#e3d9ce] bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Link
                href={`/producto/${producto.id}`}
                className="relative block h-52 bg-[#f2eee8]"
              >
                <Image
                  src={producto.imagen}
                  alt={producto.nombre}
                  fill
                  className="object-contain p-5 transition group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
              </Link>

              <div className="p-4">
                <h3 className="mb-1 min-h-10 text-sm font-semibold">
                  {producto.nombre}
                </h3>

                <p className="text-base font-bold text-[#795538]">
                  ${producto.precio.toFixed(2)}
                </p>

                <p className="mb-4 mt-1 text-xs text-[#887b72]">
                  {producto.material}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/producto/${producto.id}`}
                    className="flex min-h-9 items-center justify-center rounded border border-[#795538] px-2 text-center text-xs font-semibold text-[#795538] hover:bg-[#f5eee8]"
                  >
                    Ver detalle
                  </Link>

                  <Link
                    href="/carrito"
                    className="flex min-h-9 items-center justify-center rounded bg-[#795538] px-2 text-center text-xs font-semibold text-white hover:bg-[#60412d]"
                  >
                    Agregar al carrito
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}