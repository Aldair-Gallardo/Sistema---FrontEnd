export type PreguntaFAQ = {
  pregunta: string;
  respuesta: string;
};

export type CategoriaFAQ = {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  preguntas: PreguntaFAQ[];
};

export const categoriasFAQ: CategoriaFAQ[] = [
  {
    id: "envios",
    titulo: "Envíos",
    descripcion: "Métodos de envío, tiempos de entrega y costos.",
    icono: "🚚",
    preguntas: [
      {
        pregunta: "¿Cuánto tarda en llegar mi pedido?",
        respuesta:
          "El tiempo de entrega depende de la ubicación, disponibilidad del producto y método de envío. La fecha estimada se mostrará antes de confirmar la compra.",
      },
      {
        pregunta: "¿Cómo consulto el estado de mi envío?",
        respuesta:
          "Puedes consultar el estado desde la sección Mis pedidos dentro de tu cuenta.",
      },
      {
        pregunta: "¿El envío tiene un costo adicional?",
        respuesta:
          "El costo puede variar según la ubicación, el tamaño y el peso del pedido. El monto aparecerá antes de confirmar la compra.",
      },
    ],
  },
  {
    id: "pagos",
    titulo: "Pagos",
    descripcion: "Métodos de pago, seguridad y comprobantes.",
    icono: "💳",
    preguntas: [
      {
        pregunta: "¿Qué métodos de pago están disponibles?",
        respuesta:
          "Los métodos habilitados aparecerán durante el proceso de compra. Pueden incluir tarjetas, transferencias u otras opciones configuradas por TECA.",
      },
      {
        pregunta: "¿Es seguro pagar desde la página?",
        respuesta:
          "Los pagos deben procesarse mediante servicios seguros. La información sensible de la tarjeta no debe almacenarse directamente en el navegador.",
      },
      {
        pregunta: "¿Dónde consulto mi comprobante?",
        respuesta:
          "Puedes consultar el comprobante y los detalles de la compra desde la sección Mis pedidos.",
      },
    ],
  },
  {
    id: "devoluciones",
    titulo: "Devoluciones",
    descripcion: "Cambios, devoluciones y reembolsos.",
    icono: "↩️",
    preguntas: [
      {
        pregunta: "¿Cómo solicito una devolución?",
        respuesta:
          "Ingresa a la sección Devoluciones de tu cuenta, selecciona el pedido correspondiente y completa la solicitud.",
      },
      {
        pregunta: "¿Qué información debo proporcionar?",
        respuesta:
          "Debes seleccionar el producto, indicar el motivo de la devolución y proporcionar la evidencia solicitada.",
      },
      {
        pregunta: "¿Cuánto tarda un reembolso?",
        respuesta:
          "El tiempo depende de la aprobación de la devolución y del método de pago utilizado originalmente.",
      },
    ],
  },
  {
    id: "cuenta",
    titulo: "Mi cuenta",
    descripcion: "Datos personales, pedidos y contraseña.",
    icono: "👤",
    preguntas: [
      {
        pregunta: "¿Cómo actualizo mis datos personales?",
        respuesta:
          "Ingresa a Mi cuenta y abre la sección de perfil. Allí podrás modificar los datos permitidos.",
      },
      {
        pregunta: "¿Dónde puedo consultar mis pedidos?",
        respuesta:
          "Todos los pedidos realizados aparecerán en la sección Mis pedidos de tu cuenta.",
      },
      {
        pregunta: "¿Qué hago si olvidé mi contraseña?",
        respuesta:
          "Utiliza la opción Recuperar contraseña disponible en la pantalla de inicio de sesión.",
      },
    ],
  },
  {
    id: "productos",
    titulo: "Productos",
    descripcion: "Disponibilidad, materiales y garantía.",
    icono: "🛋️",
    preguntas: [
      {
        pregunta: "¿Dónde puedo ver el material del producto?",
        respuesta:
          "El material aparece en la tarjeta del catálogo y en la página de detalle de cada producto.",
      },
      {
        pregunta: "¿Cómo sé si un producto está disponible?",
        respuesta:
          "La disponibilidad y el stock se mostrarán dentro de la información del producto.",
      },
      {
        pregunta: "¿Los productos tienen garantía?",
        respuesta:
          "Las condiciones de garantía deben aparecer en la descripción o en la página de detalle del producto.",
      },
    ],
  },
];