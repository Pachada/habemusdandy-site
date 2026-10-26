const DEFAULT_APP_ORIGIN = 'https://app.horaya.mx'

export const appOrigin = (
  import.meta.env.PUBLIC_APP_ORIGIN || DEFAULT_APP_ORIGIN
).replace(/\/$/, '')

export const appLoginUrl = `${appOrigin}/login`
export const appSignupUrl = `${appOrigin}/signup`
export const salesEmail = 'hola@horaya.mx'
export const salesContactUrl = `mailto:${salesEmail}?subject=${encodeURIComponent('Hablar con ventas')}`

export const siteName = 'Horaya'

/** List amounts stay visible as the reference; promo is the current launch offer. */
export const equiposPricing = {
  currency: 'MXN',
  monthlyList: 249,
  monthlyPromo: 199,
  annualListPerMonth: 199,
  annualPromoPerMonth: 149,
  annualBilled: 1788,
  annualSavings: 600,
  annualDiscountPct: 25,
} as const

export function formatMxn(amount: number) {
  return `$${amount.toLocaleString('en-US')}`
}

export const navLinks = [
  { href: '/producto', label: 'Producto' },
  { href: '/precios', label: 'Precios' },
] as const

export const footerProductLinks = [
  { href: '/producto', label: 'Producto' },
  { href: '/precios', label: 'Precios' },
  { href: '/seguridad', label: 'Seguridad' },
] as const

export const footerLegalLinks = [
  { href: '/privacidad', label: 'Políticas de privacidad' },
  { href: '/terminos', label: 'Términos y condiciones' },
] as const

export const faqItems = [
  {
    question: '¿Por qué usar una herramienta de gestión si ya tengo WhatsApp y Calendar?',
    answer:
      'WhatsApp sirve para conversar y Calendar para bloquear tiempo, pero ninguno conserva juntos el ingreso, el expediente, las notas y el seguimiento. Horaya conecta ese flujo para que el equipo deje de reconstruir la historia en cada visita.',
  },
  {
    question: '¿Qué diferencia a Horaya de una agenda online?',
    answer:
      'No empieza y termina en reservar una hora. Está pensado para negocios que trabajan con citas: disponibilidad, servicios, ingreso, ficha, notas y continuidad viven en el mismo flujo. Es una herramienta de operación, no solo un calendario con una página de reservas.',
  },
  {
    question: '¿Cómo sé si Horaya encaja con mi negocio?',
    answer:
      'Encaja si tu día gira alrededor de citas, servicios, clientes e historial. Funciona en fisioterapia, odontología, psicología, nutrición, estética y cualquier negocio que trabaje con citas: tú defines los servicios, su duración y el formulario de ingreso.',
  },
  {
    question: '¿Mis clientes necesitan crear una cuenta?',
    answer:
      'No. El equipo trabaja en el panel. Tu cliente solo abre el enlace de ingreso cuando tú se lo envías; no ve la agenda ni las notas.',
  },
  {
    question: '¿Puedo adaptar la herramienta a la forma en que trabaja mi equipo?',
    answer:
      'Sí. Configuras servicios, duración, precios, horarios, excepciones y formularios de ingreso. También defines qué puede hacer cada persona según su rol: Owner, Manager o Staff.',
  },
  {
    question: '¿Dónde quedan los datos de mi negocio?',
    answer:
      'Cada negocio es un espacio aislado. Solo el personal con el rol adecuado ve fichas y notas, y tus clientes no entran al panel. Consulta la página de Seguridad para conocer el enfoque de acceso y privacidad.',
    answerHtml:
      'Cada negocio es un espacio aislado. Solo el personal con el rol adecuado ve fichas y notas, y tus clientes no entran al panel. Consulta la página de <a href="/seguridad">Seguridad</a> para conocer el enfoque de acceso y privacidad.',
  },
  {
    question: '¿Hay una versión gratis o es solo una prueba?',
    answer:
      'Hay un plan Gratis, no una prueba que vence. Cubre la operación esencial de una persona: agenda, citas, servicios, clientes, expediente y notas de cada visita. Cuando necesites más personas, formularios, recordatorios o reportes, pasas a Equipos.',
  },
] as const

export const pricingFaqItems = [
  {
    question: '¿Qué cambia realmente al pasar de Gratis a Equipos?',
    answer:
      'Gratis cubre la operación esencial: citas, clientes, expediente y notas de cada visita. Equipos suma roles, formularios, automatizaciones, reportes e integraciones para que el equipo trabaje sobre el mismo contexto.',
  },
  {
    question: '¿El plan Gratis es una prueba de unos días?',
    answer:
      'No. Gratis es un plan, no una prueba con fecha de vencimiento. Incluye agenda, citas, servicios, clientes, expediente y notas de cada visita para una persona. Pasas a Equipos cuando sumas personas a tu equipo o quieres formularios, recordatorios, reportes e integraciones.',
  },
  {
    question: '¿Qué cuenta como un asiento?',
    answer:
      `Un asiento es una persona del equipo con acceso al espacio de trabajo. El precio de lista es ${formatMxn(equiposPricing.monthlyList)} ${equiposPricing.currency} al mes, o ${formatMxn(equiposPricing.annualListPerMonth)} ${equiposPricing.currency} al mes si pagas anual. En la promoción de lanzamiento, el asiento queda en ${formatMxn(equiposPricing.monthlyPromo)} ${equiposPricing.currency} al mes, o ${formatMxn(equiposPricing.annualPromoPerMonth)} ${equiposPricing.currency} al mes si pagas anual.`,
  },
  {
    question: '¿Cómo sé si necesito Equipos?',
    answer:
      'Si trabajas solo y necesitas ordenar citas, clientes y notas, Gratis puede ser suficiente. Equipos tiene sentido cuando colaboran varias personas o quieres formularios, roles, automatizaciones, reportes e integraciones en la operación diaria.',
  },
  {
    question: '¿Los precios incluyen IVA?',
    answer:
      'Sí. Todos los precios publicados están en pesos mexicanos e incluyen IVA. Lo que ves en la tarjeta es lo que pagas por asiento.',
  },
  {
    question: '¿Cómo funciona el pago anual?',
    answer:
      `Si eliges anual, Equipos queda en ${formatMxn(equiposPricing.annualPromoPerMonth)} ${equiposPricing.currency} por asiento al mes (precio de lista ${formatMxn(equiposPricing.annualListPerMonth)}), facturados como ${formatMxn(equiposPricing.annualBilled)} ${equiposPricing.currency} al año. Frente a pagar ${formatMxn(equiposPricing.monthlyPromo)} al mes, ahorras ${formatMxn(equiposPricing.annualSavings)} al año por cada asiento — un ${equiposPricing.annualDiscountPct}%.`,
  },
  {
    question: '¿Qué diferencia a Horaya de una agenda genérica?',
    answer:
      'Horaya conecta agenda, ingreso, ficha y notas en un mismo flujo. El valor no está solo en encontrar un hueco: está en que el contexto de la visita llegue preparado y permanezca para la siguiente.',
  },
  {
    question: '¿Qué pasa con mis datos si dejo de usarlo?',
    answer:
      'Tus datos siguen siendo de tu negocio. Consulta Políticas de privacidad y Términos y condiciones para el tratamiento, la conservación y las condiciones del servicio.',
    answerHtml:
      'Tus datos siguen siendo de tu negocio. Consulta <a href="/privacidad">Políticas de privacidad</a> y <a href="/terminos">Términos y condiciones</a> para el tratamiento, la conservación y las condiciones del servicio.',
  },
] as const
