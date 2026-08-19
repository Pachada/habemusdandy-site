const DEFAULT_APP_ORIGIN = 'https://app.habemusfisio.com'

export const appOrigin = (
  import.meta.env.PUBLIC_APP_ORIGIN || DEFAULT_APP_ORIGIN
).replace(/\/$/, '')

export const appLoginUrl = `${appOrigin}/login`
export const appSignupUrl = `${appOrigin}/signup`
export const salesContactUrl = 'mailto:hola@habemusdandy.com?subject=Hablar%20con%20ventas'

export const siteName = 'HabemusDandy'

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

export const faqItems = [
  {
    question: '¿Por qué usar una herramienta de gestión si ya tengo WhatsApp y Calendar?',
    answer:
      'WhatsApp sirve para conversar y Calendar para bloquear tiempo, pero ninguno conserva juntos el ingreso, la ficha, las notas y el seguimiento. HabemusDandy conecta ese flujo para que el equipo deje de reconstruir la historia en cada visita.',
  },
  {
    question: '¿Qué diferencia a HabemusDandy de una agenda online?',
    answer:
      'No empieza y termina en reservar una hora. Está pensado para clínicas: disponibilidad, servicios, ingreso, ficha, notas y continuidad viven en el mismo flujo. Es una herramienta de operación clínica, no solo un calendario con una página de reservas.',
  },
  {
    question: '¿Cómo sé si HabemusDandy encaja con mi clínica?',
    answer:
      'Encaja si tu día gira alrededor de citas, servicios, pacientes e historial. Empezamos con fisioterapia, pero la lógica también sirve para consultas y prácticas que necesitan ordenar su atención sin perder contexto.',
  },
  {
    question: '¿El paciente necesita crear una cuenta?',
    answer:
      'No. El equipo trabaja en el panel. El paciente solo abre el enlace de ingreso cuando tú se lo envías; no ve la agenda ni las notas clínicas.',
  },
  {
    question: '¿Puedo adaptar la herramienta a la forma en que trabaja mi equipo?',
    answer:
      'Sí. Configuras servicios, duración, precios, horarios, excepciones y formularios de ingreso. También defines qué puede hacer cada persona según su rol: Owner, Manager o Staff.',
  },
  {
    question: '¿Dónde quedan los datos de mi clínica?',
    answer:
      'Cada clínica es un espacio aislado. Solo el personal con el rol adecuado ve fichas y notas, y los pacientes no entran al panel. Consulta la página de Seguridad para conocer el enfoque de acceso y privacidad.',
    answerHtml:
      'Cada clínica es un espacio aislado. Solo el personal con el rol adecuado ve fichas y notas, y los pacientes no entran al panel. Consulta la página de <a href="/seguridad">Seguridad</a> para conocer el enfoque de acceso y privacidad.',
  },
  {
    question: '¿Puedo empezar sin comprometerme a pagar?',
    answer:
      'Sí. El plan Gratis permite comenzar con la operación esencial de la clínica. Cuando necesites trabajar con más personas, formularios e integraciones, puedes pasar a Equipos.',
  },
] as const

export const pricingFaqItems = [
  {
    question: '¿Qué cambia realmente al pasar de Gratis a Equipos?',
    answer:
      'Gratis cubre la operación esencial: citas, clientes, fichas y notas. Equipos suma colaboración con roles, formularios de ingreso, administración e integraciones para que todo el equipo trabaje sobre el mismo contexto.',
  },
  {
    question: '¿Qué cuenta como un asiento?',
    answer:
      `Un asiento es una persona del equipo con acceso al espacio de trabajo. El precio de lista es ${formatMxn(equiposPricing.monthlyList)} ${equiposPricing.currency} al mes, o ${formatMxn(equiposPricing.annualListPerMonth)} ${equiposPricing.currency} al mes si pagas anual. En la promoción de lanzamiento, el asiento queda en ${formatMxn(equiposPricing.monthlyPromo)} ${equiposPricing.currency} al mes, o ${formatMxn(equiposPricing.annualPromoPerMonth)} ${equiposPricing.currency} al mes si pagas anual.`,
  },
  {
    question: '¿Cómo sé si necesito Equipos?',
    answer:
      'Si trabajas solo y necesitas ordenar citas, clientes y notas, Gratis puede ser suficiente. Equipos tiene sentido cuando colaboran varias personas o quieres usar formularios, roles e integraciones en la operación diaria.',
  },
  {
    question: '¿Cómo funciona el pago anual?',
    answer:
      `Si eliges anual, Equipos queda en ${formatMxn(equiposPricing.annualPromoPerMonth)} ${equiposPricing.currency} por asiento al mes (precio de lista ${formatMxn(equiposPricing.annualListPerMonth)}), facturados como ${formatMxn(equiposPricing.annualBilled)} ${equiposPricing.currency} al año. Frente a pagar ${formatMxn(equiposPricing.monthlyPromo)} al mes, ahorras ${formatMxn(equiposPricing.annualSavings)} al año por cada asiento — un ${equiposPricing.annualDiscountPct}%.`,
  },
  {
    question: '¿Qué diferencia a HabemusDandy de una agenda genérica?',
    answer:
      'HabemusDandy conecta agenda, ingreso, ficha y notas clínicas en un mismo flujo. El valor no está solo en encontrar un hueco: está en que el contexto de la visita llegue preparado y permanezca para la siguiente.',
  },
  {
    question: '¿Qué pasa con mis datos si dejo de usarlo?',
    answer:
      'Tus datos siguen siendo de tu clínica. Las condiciones comerciales y las opciones formales de exportación se documentarán en la información legal correspondiente a medida que estén disponibles.',
  },
] as const
