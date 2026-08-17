const DEFAULT_APP_ORIGIN = 'https://habemusfisio.com'

export const appOrigin = (
  import.meta.env.PUBLIC_APP_ORIGIN || DEFAULT_APP_ORIGIN
).replace(/\/$/, '')

export const appLoginUrl = `${appOrigin}/login`
export const appSignupUrl = `${appOrigin}/signup`
export const salesContactUrl = 'mailto:hola@habemusdandy.com?subject=Hablar%20con%20ventas'

export const siteName = 'HabemusDandy'

export const navLinks = [
  { href: '/producto', label: 'Producto' },
  { href: '/precios', label: 'Precios' },
] as const

export const footerProductLinks = [
  { href: '/producto', label: 'Producto' },
  { href: '/precios', label: 'Precios' },
  { href: '/seguridad', label: 'Seguridad' },
] as const

export const faqItems = [
  {
    question: '¿Es solo para fisioterapia?',
    answer:
      'Empezamos con clínicas de fisioterapia, pero el sistema sirve a cualquier consulta que viva de citas, fichas e historial. Si atiendes con horario y servicios, HabemusDandy encaja.',
  },
  {
    question: '¿Mis pacientes necesitan una cuenta?',
    answer:
      'No. El equipo trabaja en el panel. El paciente solo abre el enlace de ingreso cuando tú se lo envías; no ve la agenda ni las notas clínicas.',
  },
  {
    question: '¿Se sincroniza con Google Calendar?',
    answer:
      'Sí. Las citas de la clínica salen hacia un calendario de Google dedicado (una vía). También puedes suscribirte en solo lectura desde Apple Calendar con un enlace privado.',
  },
  {
    question: '¿Puedo usar mis propios formularios?',
    answer:
      'Sí. Defines los formularios de ingreso de la clínica y los envías antes de la visita. Las respuestas quedan ligadas a la ficha del cliente.',
  },
  {
    question: '¿Qué pasa con los datos de los pacientes?',
    answer:
      'Cada clínica es un espacio aislado. Solo el personal con rol adecuado ve fichas y notas. Los pacientes no entran al panel. Más detalle en Seguridad.',
    answerHtml:
      'Cada clínica es un espacio aislado. Solo el personal con rol adecuado ve fichas y notas. Los pacientes no entran al panel. Más detalle en <a href="/seguridad">Seguridad</a>.',
  },
  {
    question: '¿Puedo empezar gratis?',
    answer:
      'Sí. El plan Gratis permite comenzar con la operación esencial de la clínica. Puedes pasar al plan Equipos cuando necesites más capacidad para trabajar con otras personas.',
  },
  {
    question: '¿Funciona en el celular?',
    answer:
      'Sí. El panel está pensado para escritorio y móvil, así puedes revisar citas y fichas entre sesiones sin depender del WhatsApp.',
  },
] as const

export const pricingFaqItems = [
  {
    question: '¿El precio de Equipos es por persona?',
    answer:
      'No. Equipos se cobra por clínica: $249 al mes o el equivalente a $200 al mes cuando pagas el año completo.',
  },
  {
    question: '¿Qué incluye el plan Gratis?',
    answer:
      'Incluye las herramientas esenciales para organizar citas, clientes y notas. La tabla de esta página muestra qué capacidades añade Equipos.',
  },
  {
    question: '¿Cómo funciona el pago anual?',
    answer:
      'Equipos cuesta $2,400 por año, equivalente a $200 al mes. Frente al pago mensual de $249, ahorras $588 al año.',
  },
  {
    question: '¿Qué pasa si dejo de usar HabemusDandy?',
    answer:
      'Tus datos siguen siendo de tu clínica. Cuando existan términos comerciales y exportación formal, los documentaremos en Seguridad y legal.',
  },
] as const
