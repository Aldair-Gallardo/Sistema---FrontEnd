# Matriz de trazabilidad — User Stories → Pantalla

IDs asignados en el orden en que aparecen en el Trello del equipo (no son IDs oficiales de Trello; si el board tiene numeración propia, reemplazar acá). Excluye tarjetas que no son historias de usuario (ej. "Crear repositorio en GitHub", "Escoger UI Component", "Realizar los wireframes").

| ID | Historia de usuario | Pantalla | Ruta | Estado |
|---|---|---|---|---|
| US-01 | Continuar con Google o Apple | Login | `/login` | Parcial — botones en la UI, sin integración OAuth real |
| US-02 | Registrar una cuenta nueva | Registro | `/registro` | Implementada |
| US-03 | Filtrar productos por categoría, precio y material | Catálogo | `/catalogo` | Implementada |
| US-04 | Ver y gestionar los productos del carrito | Carrito | `/carrito` | Implementada |
| US-05 | Seleccionar método de pago y confirmar | Checkout — pago | `/checkout/pago` | Implementada — sin opción Yappy |
| US-06 | Crear usuario interno con rol asignado | Usuarios — nuevo | `/usuarios/nuevo` | Implementada |
| US-07 | Editar o eliminar un usuario interno | Usuarios — editar | `/usuarios/{id}` | Implementada |
| US-08 | Configurar permisos CRUD por rol y módulo | Permisos | `/permisos` | Implementada |
| US-09 | Recibir correo de bienvenida al crear una cuenta | (correo, sin pantalla propia) | — | Implementada (backend) |
| US-10 | Recibir correo de carrito abandonado | (correo, sin pantalla propia) | — | No implementada |
| US-11 | Gestionar preferencias de notificaciones | Mi cuenta | `/mi-cuenta` | Implementada |
| US-12 | Recibir correo cuando un producto agotado vuelve a estar disponible | (correo, sin pantalla propia) | — | No implementada |
| US-13 | Iniciar sesión con correo y contraseña | Login | `/login` | Implementada |
| US-14 | Ver estado de producto agotado y recibir aviso de disponibilidad | Detalle de producto | `/producto/{id}` | Parcial — muestra "sin stock", no hay aviso al reponerse |
| US-15 | Ver el banner/carrusel de bienvenida | Inicio | `/` | Implementada |
| US-16 | Agregar al carrito desde el detalle del producto | Detalle de producto | `/producto/{id}` | Implementada |
| US-17 | Ver y filtrar todos los pedidos desde el panel admin | Pedidos (panel) | `/pedidos` | **No implementada** — pantalla en placeholder |
| US-18 | Ver resumen financiero y movimientos del mes | Finanzas | `/finanzas` | **No implementada** — pantalla en placeholder |
| US-19 | Actualizar el estado de un pedido desde el admin | Pedidos (panel) | `/pedidos` | **No implementada** |
| US-20 | Ver alertas de stock bajo en el panel admin | Productos (panel) | `/productos` | Implementada |
| US-21 | Registrar entrada de stock de un producto | Productos — editar | `/productos/{id}` | Parcial — se edita el campo stock, sin flujo de "entrada" dedicado |
| US-22 | Ver reporte de ventas por período | Finanzas | `/finanzas` | **No implementada** |
| US-23 | Crear y gestionar cupones de descuento desde el admin | — | — | **No implementada** — sin rastro en el código |
| US-24 | Revisar y gestionar solicitudes de devolución desde el admin | Devoluciones (panel) | `/devoluciones-admin` | **No implementada** — pantalla en placeholder |
| US-25 | Recibir correo de confirmación al realizar una compra | (correo, sin pantalla propia) | — | Implementada (backend) |
| US-26 | Recibir correo cuando el estado del pedido cambia | (correo, sin pantalla propia) | — | Por confirmar |
| US-27 | Ordenar productos del catálogo | Catálogo | `/catalogo` | Implementada |
| US-28 | Ver estado vacío en búsqueda sin resultados | Búsqueda | `/buscar` | Implementada |
| US-29 | Ver estado vacío en historial de pedidos | Mis pedidos | `/mis-pedidos` | Implementada |
| US-30 | Ver estado vacío del carrito | Carrito | `/carrito` | Implementada |
| US-31 | Ver progreso hacia el envío gratis en el carrito | Carrito | `/carrito` | Por confirmar |
| US-32 | Ver notificaciones dentro de la app | Header (dropdown de notificaciones) | Global | Implementada |
| US-33 | Enviar un mensaje al equipo de TECA | Contacto | `/contacto` | Implementada |
| US-34 | Aplicar un cupón de descuento en el carrito | Carrito | `/carrito` | No implementada |
| US-35 | Realizar una compra sin crear una cuenta | Checkout | — | No implementada — checkout exige sesión iniciada |
| US-36 | Ser notificado cuando la sesión expira | — | — | No implementada |
| US-37 | Ver página de error 404 personalizada | Error 404 | `not-found` | Implementada |
| US-38 | Consultar preguntas frecuentes de la tienda | FAQ / Nosotros | `/faq`, `/nosotros` | Implementada |
| US-39 | Establecer nueva contraseña desde el enlace de recuperación | Nueva contraseña | `/nueva-contrasena` | Implementada |
| US-40 | Solicitar enlace de recuperación de contraseña | Recuperar contraseña | `/recuperar` | Implementada |
| US-41 | Ver confirmación del pedido realizado | Confirmación | `/checkout/confirmacion` | Implementada — actualizar estado en Trello |
| US-42 | Verificar el correo electrónico al registrarse | Verificar correo | `/verificar-correo` | Implementada |
| US-43 | Ingresar dirección de envío | Checkout — envío | `/checkout/envio` | Implementada — actualizar estado en Trello |
| US-44 | Recuperar contraseña olvidada | Recuperar contraseña | `/recuperar` | Implementada — revisar si es duplicado de US-40 |
| US-45 | Ver resumen de operaciones del día en el panel admin | Panel | `/panel` | Implementada |
| US-46 | Explorar productos destacados en home | Inicio | `/` | Implementada |
| US-47 | Ver detalle de un pedido específico | Mis pedidos — detalle | `/mis-pedidos/{id}` | Implementada — actualizar estado en Trello |
| US-48 | Ver historial de pedidos | Mis pedidos | `/mis-pedidos` | Implementada — actualizar estado en Trello |
| US-49 | Buscar productos por nombre o categoría | Búsqueda | `/buscar` | Implementada |
| US-50 | Ver detalle completo de un producto | Detalle de producto | `/producto/{id}` | Implementada |
| US-51 | Navegar entre secciones de mi cuenta | Mi cuenta (sidebar) | `/mi-cuenta` | Implementada |
| US-52 | Gestionar el catálogo de productos desde el admin | Productos (panel) | `/productos` | Implementada |
| US-53 | Calificar y dejar reseña de un producto comprado | Detalle de producto (reseñas) | `/producto/{id}` | Implementada |
| US-54 | Rastrear el estado de entrega de un pedido | Mis pedidos — detalle | `/mis-pedidos/{id}` | Implementada |
| US-55 | Solicitar devolución o cambio de un producto | Devoluciones — nueva | `/devoluciones/nueva` | Implementada |
| US-56 | Ver el estado de una solicitud de devolución | Devoluciones — detalle | `/devoluciones/{id}` | Implementada |
