/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { App, Button, Spin, Tooltip } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { obtenerProductoPublico, urlImagen } from '@/lib/api/productos';
import { listarResenas } from '@/lib/api/resenas';
import { listarPedidos } from '@/lib/api/pedidos';
import { CATEGORIA_LABELS, MATERIAL_LABELS, type Producto } from '@/types/producto';
import type { Resena } from '@/types/resena';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import { ResenaModal } from './ResenaModal';

const AVATAR_COLORS = ['#795538', '#966342', '#a97155', '#6f4e37', '#8c6a4e', '#5c4a3a'];

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase();
}

function colorAvatar(nombre: string): string {
  const hash = nombre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-PA', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

interface ProductoDetalleProps {
  productoId: string;
}

export function ProductoDetalle({ productoId }: ProductoDetalleProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { message } = App.useApp();
  const { agregarItem } = useCart();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargandoProducto, setCargandoProducto] = useState(true);
  const [errorProducto, setErrorProducto] = useState<string | null>(null);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  const [resenas, setResenas] = useState<Resena[]>([]);
  const [totalResenas, setTotalResenas] = useState(0);
  const [promedioResenas, setPromedioResenas] = useState(0);
  const [distribucion, setDistribucion] = useState<Record<string, number>>({});
  const [paginaResenas, setPaginaResenas] = useState(1);
  const [cargandoResenas, setCargandoResenas] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(false);

  // Solo puede reseñar quien tiene un pedido entregado que incluya este producto
  // (mismo criterio que usa el backend para la etiqueta "Compra verificada").
  const [puedeResenar, setPuedeResenar] = useState(false);
  const [verificandoCompra, setVerificandoCompra] = useState(false);

  useEffect(() => {
    async function cargarProducto() {
      setCargandoProducto(true);
      setErrorProducto(null);
      try {
        const doc = await obtenerProductoPublico(productoId);
        setProducto(doc);
        setImagenActiva(0);
        setCantidad(1);
      } catch (error) {
        setErrorProducto(error instanceof Error ? error.message : 'No se pudo cargar el producto');
      } finally {
        setCargandoProducto(false);
      }
    }
    cargarProducto();
  }, [productoId]);

  useEffect(() => {
    async function cargarResenasIniciales() {
      setCargandoResenas(true);
      try {
        const resultado = await listarResenas(productoId, 1);
        setResenas(resultado.resenas);
        setTotalResenas(resultado.total);
        setPromedioResenas(resultado.promedio);
        setDistribucion(resultado.distribucion);
        setPaginaResenas(1);
      } catch (error) {
        message.error(error instanceof Error ? error.message : 'No se pudieron cargar las reseñas');
      } finally {
        setCargandoResenas(false);
      }
    }
    cargarResenasIniciales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productoId]);

  useEffect(() => {
    async function verificarCompra() {
      if (!user) {
        setPuedeResenar(false);
        return;
      }
      setVerificandoCompra(true);
      try {
        const pedidos = await listarPedidos();
        setPuedeResenar(
          pedidos.some((pedido) => pedido.estado === 'entregado' && pedido.items.some((item) => item.productoId === productoId))
        );
      } catch {
        setPuedeResenar(false);
      } finally {
        setVerificandoCompra(false);
      }
    }
    verificarCompra();
  }, [user, productoId]);

  function cargarMasResenas() {
    const siguiente = paginaResenas + 1;
    setCargandoResenas(true);
    listarResenas(productoId, siguiente)
      .then((resultado) => {
        setResenas((actuales) => actuales.concat(resultado.resenas));
        setPaginaResenas(siguiente);
      })
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudieron cargar las reseñas'))
      .finally(() => setCargandoResenas(false));
  }

  function handleResenaPublicada(resena: Resena) {
    setResenas((actuales) => [resena, ...actuales]);
    setTotalResenas((actual) => actual + 1);
  }

  function abrirModalResena() {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!puedeResenar) {
      message.error('Solo puedes reseñar productos que hayas comprado y recibido');
      return;
    }
    setModalAbierto(true);
  }

  if (cargandoProducto) {
    return (
      <section className="mx-auto flex w-[calc(100%-32px)] max-w-6xl justify-center py-24 md:w-[calc(100%-48px)]">
        <Spin size="large" />
      </section>
    );
  }

  if (errorProducto || !producto) {
    return (
      <section className="mx-auto w-[calc(100%-32px)] max-w-6xl py-16 text-center md:w-[calc(100%-48px)]">
        <h2 className="text-xl font-semibold text-[#302821]">No encontramos este producto</h2>
        <p className="mt-2 text-sm text-[#756b63]">{errorProducto ?? 'Es posible que ya no esté disponible.'}</p>
        <Link
          href="/catalogo"
          className="mt-5 inline-block rounded-md bg-[#795538] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#60412d]"
        >
          Volver al catálogo
        </Link>
      </section>
    );
  }

  const sinStock = producto.stock <= 0;
  const imagenes = producto.imagenes.length > 0 ? producto.imagenes : [''];
  const imagenPrincipal = imagenes[imagenActiva] ? urlImagen(imagenes[imagenActiva]) : '';

  const detalles: { label: string; valor?: string }[] = [
    { label: 'Medidas', valor: producto.dimensiones },
    { label: 'Material principal', valor: MATERIAL_LABELS[producto.material] },
    { label: 'Estructura', valor: producto.estructura },
    { label: 'Garantía', valor: producto.garantia },
    { label: 'Color', valor: producto.color },
  ].filter((detalle) => !!detalle.valor);

  function agregarAlCarrito() {
    if (!producto || sinStock) return;
    agregarItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad,
      imagen: imagenes[0] ? urlImagen(imagenes[0]) : '',
    });
    message.success('Agregado al carrito');
  }

  function comprarAhora() {
    if (!producto || sinStock) return;
    agregarAlCarrito();
    router.push('/carrito');
  }

  return (
    <section className="mx-auto w-[calc(100%-32px)] max-w-6xl pb-20 md:w-[calc(100%-48px)]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 py-6 text-sm text-[#756b63]">
        <Link href="/" className="hover:text-[#795538]">Inicio</Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:text-[#795538]">{CATEGORIA_LABELS[producto.categoria]}</Link>
        <span>/</span>
        <span className="text-[#302821]">{producto.nombre}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Galería */}
        <div>
          <div className="relative flex h-96 items-center justify-center overflow-hidden rounded-xl border border-[#e7ddd2] bg-[#f2eee8]">
            {imagenPrincipal ? (
              <img src={imagenPrincipal} alt={producto.nombre} className="h-full w-full object-contain p-8" />
            ) : (
              <span className="text-sm text-[#756b63]">Producto sin imagen</span>
            )}
            {imagenes.length > 1 && (
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#302821]/80 px-3 py-1 text-xs font-medium text-white">
                Vista {imagenActiva + 1}
              </span>
            )}
          </div>

          {imagenes.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {imagenes.map((imagen, indice) => (
                <button
                  key={indice}
                  type="button"
                  onClick={() => setImagenActiva(indice)}
                  className={`flex h-20 items-center justify-center overflow-hidden rounded-lg border bg-[#f2eee8] transition ${
                    indice === imagenActiva ? 'border-[#795538] ring-2 ring-[#795538]/30' : 'border-[#e7ddd2] hover:border-[#c9b8a4]'
                  }`}
                >
                  {imagen ? (
                    <img src={urlImagen(imagen)} alt={`Vista ${indice + 1}`} className="h-full w-full object-contain p-2" />
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información */}
        <div>
          <h1 className="text-3xl font-bold text-[#302821]">{producto.nombre}</h1>
          <p className="mt-2 text-2xl font-bold text-[#795538]">${producto.precio.toFixed(2)}</p>

          {producto.ratingConteo > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm text-[#756b63]">
              <StarFilled style={{ color: '#d4a017' }} />
              <span className="font-semibold text-[#302821]">{producto.ratingPromedio.toFixed(1)}</span>
              <span>({producto.ratingConteo} reseña{producto.ratingConteo === 1 ? '' : 's'})</span>
            </div>
          )}

          <p className="mt-4 text-sm leading-relaxed text-[#51483f]">{producto.descripcion}</p>

          <div className="mt-5 space-y-1 text-sm text-[#51483f]">
            <p>
              <span className="font-semibold text-[#302821]">Materiales:</span> {MATERIAL_LABELS[producto.material]}
            </p>
            {producto.color && (
              <p>
                <span className="font-semibold text-[#302821]">Color:</span> {producto.color}
              </p>
            )}
            <p>
              <span className="font-semibold text-[#302821]">Disponibilidad:</span>{' '}
              {sinStock ? <span className="text-red-600">Agotado</span> : `En stock (${producto.stock})`}
            </p>
          </div>

          {/* Cantidad */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium text-[#51483f]">Cantidad</span>
            <div className="flex items-center overflow-hidden rounded-md border border-[#d8cec4]">
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                disabled={sinStock || cantidad <= 1}
                className="h-9 w-9 bg-[#f7f2e9] text-lg transition hover:bg-[#eaddce] disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>
              <span className="flex h-9 min-w-10 items-center justify-center border-x border-[#d8cec4] text-sm">
                {sinStock ? 0 : cantidad}
              </span>
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.min(producto.stock, c + 1))}
                disabled={sinStock || cantidad >= producto.stock}
                className="h-9 w-9 bg-[#f7f2e9] text-lg transition hover:bg-[#eaddce] disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              type="primary"
              size="large"
              block
              disabled={sinStock}
              onClick={agregarAlCarrito}
              style={{ background: '#6F4E37', borderColor: '#6F4E37' }}
            >
              {sinStock ? 'Sin stock' : 'Agregar al carrito'}
            </Button>
            <Button size="large" block disabled={sinStock} onClick={comprarAhora}>
              Comprar ahora
            </Button>
          </div>

          {/* Detalles del producto */}
          {detalles.length > 0 && (
            <div className="mt-8 border-t border-[#eee5dc] pt-6">
              <h2 className="mb-3 text-base font-semibold text-[#302821]">Detalles del producto</h2>
              <ul className="space-y-2 text-sm text-[#51483f]">
                {detalles.map((detalle) => (
                  <li key={detalle.label} className="flex gap-2">
                    <span className="text-[#966342]">•</span>
                    <span>
                      <span className="font-medium text-[#302821]">{detalle.label}:</span> {detalle.valor}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Reseñas del producto */}
      <div className="mt-16 border-t border-[#eee5dc] pt-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-[#302821]">Reseñas del producto</h2>
          <Tooltip
            title={
              user && !verificandoCompra && !puedeResenar
                ? 'Solo pueden reseñar quienes compraron y recibieron este producto'
                : undefined
            }
          >
            <Button onClick={abrirModalResena} disabled={!!user && !verificandoCompra && !puedeResenar} loading={!!user && verificandoCompra}>
              Escribir reseña
            </Button>
          </Tooltip>
        </div>

        {totalResenas > 0 && (
          <div className="mb-8 grid gap-8 rounded-xl border border-[#e7ddd2] bg-white p-6 sm:grid-cols-[auto_1fr]">
            <div className="flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-[#302821]">{promedioResenas.toFixed(1)}</span>
              <div className="mt-1 flex gap-0.5 text-[#d4a017]">
                {[1, 2, 3, 4, 5].map((estrella) => (
                  <StarFilled key={estrella} style={{ opacity: estrella <= Math.round(promedioResenas) ? 1 : 0.25 }} />
                ))}
              </div>
              <span className="mt-1 text-xs text-[#756b63]">Basado en {totalResenas} reseña{totalResenas === 1 ? '' : 's'}</span>
            </div>

            <div className="flex flex-col justify-center gap-1.5">
              {[5, 4, 3, 2, 1].map((estrella) => {
                const cantidadEstrella = distribucion[String(estrella)] ?? 0;
                const porcentaje = totalResenas > 0 ? (cantidadEstrella / totalResenas) * 100 : 0;
                return (
                  <div key={estrella} className="flex items-center gap-2 text-xs text-[#756b63]">
                    <span className="w-8 shrink-0">{estrella}★</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f2eee8]">
                      <div className="h-full rounded-full bg-[#d4a017]" style={{ width: `${porcentaje}%` }} />
                    </div>
                    <span className="w-6 shrink-0 text-right">{cantidadEstrella}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {cargandoResenas && resenas.length === 0 ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : resenas.length === 0 ? (
          <p className="text-sm text-[#756b63]">Aún no hay reseñas de este producto. ¡Sé el primero en escribir una!</p>
        ) : (
          <div className="space-y-4">
            {resenas.map((resena) => (
              <div key={resena.id} className="rounded-xl border border-[#e7ddd2] bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={{ background: colorAvatar(resena.usuarioNombre) }}
                    >
                      {iniciales(resena.usuarioNombre)}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-[#302821]">{resena.usuarioNombre}</span>
                        {resena.compraVerificada && (
                          <span className="rounded-full border border-green-600 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                            Compra verificada
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex gap-0.5 text-[#d4a017] text-xs">
                        {[1, 2, 3, 4, 5].map((estrella) => (
                          <StarFilled key={estrella} style={{ opacity: estrella <= resena.calificacion ? 1 : 0.25 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-[#756b63]">{formatearFecha(resena.fecha)}</span>
                </div>
                <p className="mt-3 text-sm text-[#51483f]">{resena.comentario}</p>
              </div>
            ))}
          </div>
        )}

        {resenas.length < totalResenas && (
          <div className="mt-6 flex justify-center">
            <Button loading={cargandoResenas} onClick={cargarMasResenas}>
              Ver más reseñas ({resenas.length} de {totalResenas})
            </Button>
          </div>
        )}
      </div>

      <ResenaModal
        productoId={producto.id}
        productoNombre={producto.nombre}
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onPublicada={handleResenaPublicada}
      />
    </section>
  );
}
