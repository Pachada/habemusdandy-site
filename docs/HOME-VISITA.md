# Homepage: historia, color y movimiento (especificación)

Especificación de la homepage, ya implementada en `src/pages/index.astro` y `src/components/ClinicJourney.astro`. No reabre la migración de dominio ni la marca (commit `7336ff9`). `docs/SITE.md` es la fuente de verdad del sitio; este documento conserva el porqué de la visita.

Referencias revisadas: `calendly/0–10.png`, `cal/0–7.png` (móvil, en orden de scroll) y el contenido de escritorio de `calendly.com/?redirect=false` y `cal.com/es/`. El movimiento descrito de Calendly y Cal sale de lo que muestran las capturas (estados intermedios, elementos atenuados) y de la estructura de escritorio; no se grabó en navegador.

---

## 1. Qué hacen ellos con el color y el movimiento

**Calendly, el día (capturas 2–4).** Cada capítulo (Book, Prep, Capture, Follow up) es una card que arriba es blanca y abajo se tiñe. El texto y la línea de tiempo viven en la parte blanca; el lavado de color sube desde el borde inferior y el mock del producto flota sobre la tinta, con sombra, sin card blanca detrás. La línea de tiempo son tres pasos con un punto de color, unidos por una línea fina. Cada capítulo tiene su propia mezcla (azul, naranja con lima, violeta). El texto nunca está sobre la tinta.

**Calendly, el catálogo (capturas 5–7).** Cambia de sistema a propósito: título con serifa, separadores finos, y un escenario de un solo degradado azul fuerte para todas las piezas. Las piezas que todavía no alcanzas aparecen atenuadas y se encienden al llegar. Ahí el color identifica la categoría, no el momento.

**Calendly, movimiento.** El carrusel del hero (captura 0) está capturado a medio fundido: dos títulos superpuestos. Es un carrusel con autoplay que cruza textos. Los capítulos del día no muestran estados intermedios: el texto queda quieto y solo el mock cambia.

**Cal (capturas 2–6).** Cards blancas sobre fondo gris, número en pastilla gris («01»), título, una línea y el mock en escala de grises, recortado por el borde de la card. El único color sale del producto (eventos de calendario en lila, rosa y azul en la captura 5) y de los logos. «Cómo funciona» son tres pasos de configuración y nada más. No se ve movimiento narrativo; la profundidad se resuelve con líneas finas y cruces en las esquinas.

**Lo que tomamos.** De Calendly: una tinta por capítulo, el mock sobre la tinta, los puntos de estado en una línea de tiempo y el texto quieto. De Cal: card blanca sobre gris con número en pastilla para la puesta en marcha, y color que sale solo del producto en todo lo que no es la visita.

Regla de la página, en una frase: **la tinta es de la visita; la puesta en marcha y el inventario son blancos y el color lo pone el producto.**

---

## 2. Orden final de secciones

| # | Sección | Su trabajo |
| --- | --- | --- |
| 1 | Hero | Prometer la clínica en un solo lugar y mostrar el panel de hoy. |
| 2 | Problema | Nombrar los tres casos: el chat visto, la ficha en cero, el hilo cortado. |
| — | Puente | Abrir el mismo día, ya resuelto. |
| 3 | La visita (`#recorrido`) | Responder los tres casos, en orden, con una sola visita de Ana Rojas. |
| 4 | Cómo empezar (`#como-empezar`) | Decir qué configuras para que esa visita funcione: horario, servicios, formulario de ingreso. |
| 5 | Más que una agenda (bento) | Mostrar el inventario alrededor de la visita y mandar a `/producto`. |
| 6 | Calendarios | Decir, quieto, que las citas se ven en Google Calendar y Apple Calendar. |
| — | Puente | «El plan cubre la operación.» |
| 7 | Precios, FAQ, cierre navy | Sin cambios. |

Fondo de cada banda, para que alternen: Hero en paper; Problema en cálido (como hoy); La visita en paper (deja de ser navy); Cómo empezar en `--color-frame`; bento y calendarios en paper; cierre navy. El cierre navy queda como la única banda oscura de ancho completo.

---

## 3. Copy: qué se queda, qué cambia, qué se va

### 3.1 Hero

- Se queda: «Para clínicas», «La clínica, en un solo lugar.», el subtítulo, «Comenzar gratis», «Plan gratuito · Configuración en minutos», el panel con «Ingreso completo» y «Nota lista».
- Cambia el botón secundario (ghost):
  - Actual: «Ver cómo funciona» → `#como-funciona`
  - Propuesto: «Ver una visita» → `#recorrido`
- Se elimina `HeroVisitSequence` (la tarjetita que rota «¿Tienes el jueves a las 5?» → «Jueves · 17:00 Confirmada» → «Ficha de Ana Rojas» cada 2,4 s). Es la cuarta vez que se cuenta la visita y el único carrusel que se repite sin fin en la página. Esa historia ahora la cuenta la sección 3, una pantalla más abajo. El panel y sus dos señales siguen.

### 3.2 Problema

- Se quedan el label, «Hoy la clínica se arma en el chat.» y los tres casos, palabra por palabra.
- Puente de salida:
  - Actual: «**El chat no es un sistema.** El siguiente paso es un horario real, una reserva en la agenda y la ficha lista al atender.»
  - Propuesto: «**El chat no es un sistema.** Así se ve el mismo jueves cuando la visita vive en un solo lugar.»
  - Por qué: el actual describe configuración; el nuevo abre el día y retoma el «jueves a las 5» del primer caso.

### 3.3 La visita

Encabezado de la sección:

- Se queda el label «Una cita, de principio a fin».
- Se queda «El contexto avanza con cada visita.»
- Se queda el lead «Cada paso deja listo el siguiente. El equipo atiende con el hilo a la vista, no reconstruyéndolo.» y el enlace de texto «Comenzar gratis».
- Se elimina «Selecciona cada momento para recorrer la cita.» y «Desliza para ver más momentos →». En móvil ya no hay rail que deslizar; en escritorio las pestañas se explican solas.

Cada capítulo tiene: kicker, título, **remate** (nuevo, una línea en tinta, al estilo de «Never walk into a meeting cold.»), texto y una línea de tiempo de tres estados que reemplaza a la cajita de señal con pulso (`.journey__signal`). El remate y la línea de tiempo son los que responden al caso del problema. La paciente es Ana Rojas en los cuatro.

**01 · Antes de la visita · responde «Dijiste que revisabas y no contestaste»**

- Título (se queda): «La cita entra en la agenda»
- Remate (nuevo): «Sin "deja checo y te aviso".»
- Texto:
  - Actual: «El horario y la duración del servicio ya están definidos. La semana se mantiene clara para todo el equipo.»
  - Propuesto: «El horario y la duración del servicio ya están definidos. Ves el hueco libre y la cita queda en la agenda, no en un chat visto.»
- Línea de tiempo: `idle` Horario y duración definidos · `idle` Jueves 17:00 libre · `ok` Cita confirmada · Jue 17:00
- Pestaña (escritorio): «Cita confirmada». Detalle: actual «Mar · 10:00 · Revisión» → propuesto «Jue · 17:00 · Revisión». El bloque resaltado del mock de agenda tiene que ser jueves 17:00.

**02 · Antes de atender · responde «Cada visita empieza de cero» (primera mitad)**

- Título (se queda): «El ingreso llega con tiempo»
- Remate (nuevo): «Nada que preguntar en la puerta.»
- Texto (se queda): «El paciente completa sus datos y el motivo de consulta antes de entrar al box.»
- Línea de tiempo: `idle` Formulario vinculado a la cita · `ok` Datos y motivo de consulta · `ok` Ingreso recibido
- Nota de plan (nueva, ver 3.7): «Formularios de ingreso: en Equipos y Empresas.»
- Pestaña: «Ingreso recibido». Detalle se queda.

**03 · Durante la sesión · responde «Cada visita empieza de cero» (segunda mitad)**

- Título (se queda): «La ficha abre con contexto»
- Remate (nuevo): «La sesión empieza donde quedó la anterior.»
- Texto:
  - Actual: «Datos, visitas anteriores y próximos pasos permanecen juntos; no hay que reconstruir la historia desde un chat.»
  - Propuesto: «Datos, visitas anteriores y la nota de la última sesión, juntos al abrir la ficha. Ya no vuelves a preguntar lo que sabías.»
- Línea de tiempo (espejo de la ficha vacía del problema): `warn` Sesión en curso · Ana Rojas · `ok` Última visita · hace 2 semanas · `ok` Nota previa vinculada
- Pestaña: «Contexto listo». Detalle se queda.

**04 · Después de atender · responde «La sesión termina y el hilo se corta»**

- Título (se queda): «El seguimiento queda preparado»
- Remate (nuevo): «El hilo sigue después de la sesión.»
- Texto:
  - Actual: «La nota de la sesión y el plan para la siguiente visita continúan en el mismo flujo.»
  - Propuesto: «La nota queda guardada, la próxima cita en la agenda y el plan a la vista en la ficha. El seguimiento ya no vive en la cabeza.»
- Línea de tiempo (espejo exacto del tercer caso, que decía «Sesión 6 · finalizada / Sin próxima / Plan no registrado»): `idle` Sesión 6 · finalizada · `ok` Próxima cita agendada · `ok` Plan registrado
- Pestaña: «Seguimiento preparado». Detalle se queda.
- No se menciona «recordatorio»: los recordatorios son Automatizaciones, de Equipos y Empresas, y meterlos aquí ataría la visita a un plan.

### 3.4 Cómo empezar

- Label: actual «Cómo funciona» → propuesto «Cómo empezar». El id pasa de `como-funciona` a `como-empezar` (nada más en `src/` apunta al anterior).
- H2 (se queda): «Empezar no debería tomar una semana.»
- Lead:
  - Actual: «Horario, servicios y la primera cita. El resto del flujo ya está en el mismo sitio.»
  - Propuesto: «Horario, servicios y formulario de ingreso. Con eso, la próxima visita corre como la acabas de ver.»
- Botones: se queda «Comenzar gratis» (primario). Se elimina «Ver el flujo de una visita» (ghost a `#recorrido`): la visita ahora está justo arriba.

| # | Actual | Propuesto |
| --- | --- | --- |
| 01 | «Define horario y servicios» / «Cuándo atiendes y qué ofreces» | «Define tu horario» / «Los días y horas en que atiendes.» |
| 02 | «Recibe la reserva» / «El hueco queda en la agenda, no en el chat» | «Da de alta tus servicios» / «Qué ofreces, cuánto dura y cuánto cuesta.» |
| 03 | «Atiende con la ficha lista» / «Datos y visitas anteriores al abrir» | «Prepara el formulario de ingreso» / «Los datos y el motivo de consulta que quieres antes de la cita.» + nota de plan |

Mocks: 01 `hours` (micro `availability`), 02 `services` compacto, 03 `intake` compacto.

### 3.5 Más que una agenda (bento)

- Se quedan el label «Más que una agenda», «La operación alrededor de la visita.» y el enlace «Ver todas las capacidades» → `/producto`.
- Lead:
  - Actual: «Servicios, formularios, horario y roles. Cada pieza con su lugar, sin otra herramienta.»
  - Propuesto: «El panel del día, los roles del equipo y el detalle de cada pieza. Sin otra herramienta.»
- Se elimina el puente «**La primera cita no basta.** Servicios, formularios, horario y roles son lo que sostiene el resto del día.» El bento es inventario y no necesita que lo narren.

Como Cómo empezar ya enseña horario, servicios y formulario, tres tiles del bento muestran ahora la capa siguiente, no la misma:

| Tile | Actual | Propuesto | Qué enseña el mock |
| --- | --- | --- | --- |
| Panel principal | «Hoy, sin buscar en cinco lugares.» / «Citas de hoy, estados y acciones rápidas en la vista que abre el equipo.» | Se queda | Panel con estados |
| Servicios | «Duración, precio y color de cada atención, listos para la agenda.» | «Color por servicio, para distinguir cada atención de un vistazo.» | Los chips de color, no la lista con duración y precio |
| Formularios | «Ingreso con tu marca, consentimiento y firma en el mismo flujo.» | «Tu marca, consentimiento y firma en el mismo formulario.» | La fila de consentimiento y firma, no los campos de datos |
| Horario | «Disponibilidad semanal, excepciones de fecha y zona horaria.» | «Excepciones de fecha y zona horaria, sin rehacer la semana.» | Una excepción de fecha, no la semana con bloques |
| Equipo y roles | «Acceso según el rol: Owner, Manager o Staff, sin compartirlo todo.» | Se queda | Roles |

Si `ProductFrame` no tiene esos recortes, se agregan como `micro` nuevos. Ninguna combinación de variante y `micro` se repite entre Cómo empezar y el bento.

Nota de plan, una sola, al pie del bento: «Formularios, equipo y roles: en Equipos y Empresas.»

### 3.6 Calendarios

- Se queda todo el copy: «Integraciones», «Se conecta con lo que ya usas.», el lead, las dos cards y «Ver integraciones».
- Se elimina el puente «**La operación ya está en el sistema.** Sigue una visita de principio a fin.»
- Nota de plan (nueva), debajo del lead: «Incluido en Equipos y Empresas.»

### 3.7 Notas de plan

`/precios` marca «Formularios de ingreso», «Equipo y roles» y «Google y Apple Calendar» como `—` en Gratis. La homepage los muestra bajo «Comenzar gratis», así que se avisa en presente, sin futuro y sin «Próximamente». Forma única: texto de 0,8 rem en `--color-muted`, sin pastilla, sin color, sin icono. Aparece en el capítulo 02, en el paso 03, al pie del bento y en calendarios. No se cambian precios.

### 3.8 Precios, FAQ, cierre

Sin cambios. El puente «**El plan cubre la operación.** Elige la capacidad con la que empiezas.» se mueve para quedar después de calendarios.

---

## 4. La visita en móvil y en escritorio

Un solo marcado: cuatro `<article>` en orden. Por debajo de 860 px se leen apilados. Desde 860 px el JS los convierte en pestañas. Sin JS, también se leen apilados en escritorio.

### 4.1 Móvil (< 860 px): tarjetas apiladas

- Cuatro cards, una debajo de otra, con `--space-4` entre ellas. Sin rail, sin `role="tab"`, sin `hidden`, sin autoplay, sin sticky ni apilado que se superpone al bajar.
- Cada card mide al menos una pantalla: `min-height: calc(100svh - var(--header-h) - 2 * var(--space-4))`. Con `max-height: 640px` de viewport, `min-height: auto`, para no dejar huecos en teléfonos bajos.
- Dentro, de arriba abajo, sobre blanco: kicker con un punto de su color (ver 5.1), título H3, remate, texto, línea de tiempo de tres estados (punto + texto, unidos por una línea de 1 px a `--color-ink` 12 %), nota de plan si toca.
- Abajo, el escenario con tinta ocupa el resto de la altura (flex 1) y llega a los bordes de la card. El mock va centrado, en variante compacta. La agenda del capítulo 01 se recorta a dos días, jueves incluido.
- Nada se desborda en horizontal: el mock se recorta por abajo, nunca por la derecha.

### 4.2 Escritorio (≥ 860 px): pestañas

- El rail va encima de la card, sobre el paper, como control segmentado sobre `--color-frame`. Cuatro pestañas: punto de color del capítulo, número «01»–«04» y estado («Cita confirmada»…). La seleccionada va en blanco con `--shadow-card`. El subrayado de progreso usa el color clave del capítulo (ver 5.1).
- Debajo, una sola card de capítulo (blanca, `--radius-xl`, `--shadow-surface`), con dos columnas: texto a la izquierda sobre blanco (kicker, título, remate, texto, línea de tiempo) y escenario con tinta a la derecha, que llega al borde superior, derecho e inferior. Desaparece el contenedor blanco que hoy envuelve rail y panel con `--shadow-float`.
- La altura de la card se fija a la del capítulo más alto (hoy `34rem`) para que el cambio no mueva la página.
- Teclado y ARIA como hoy (flechas, `aria-selected`, `tabindex`). Al cruzar los 860 px (`matchMedia`) se arman o se desarman las pestañas.

---

## 5. Superficie, tinta y sombra de cada card

### 5.1 Tintas de la visita

Objetivo: llamativo sin pasarse. La tinta se tiene que ver a primera vista en cualquier pantalla, pero sigue siendo de un solo tono y nunca va detrás del texto.

Cada capítulo toma el tono del estado de producto con el que lo cuenta el mock. Los chips del producto no compiten con la tinta, porque viven dentro del mock, que tiene su propio fondo blanco. Son tokens nuevos en `global.css`, construidos solo con tokens existentes. Cada capítulo tiene tres valores: la tinta (el lavado en su punto más intenso), el resplandor detrás del mock y el color clave (el punto del kicker, el punto de la pestaña y la barra de progreso).

| Capítulo | Tinta (`--tint-*`) | Resplandor (`--tint-*-glow`) | Color clave (`--tint-*-key`) | Estado de producto del que sale |
| --- | --- | --- | --- | --- |
| 01 Cita | `color-mix(in srgb, var(--color-brand) 16%, var(--color-surface))` | marca al 22 % | `--color-brand` | La cita confirmada, que en el mock de agenda ya es azul |
| 02 Ingreso | `color-mix(in srgb, var(--color-status-ok) 16%, var(--color-surface))` | `ok` al 22 % | `--color-status-ok` | «Ingreso completo», confirmada |
| 03 Ficha | `color-mix(in srgb, var(--color-status-warn) 18%, var(--color-surface))` | `warn` al 24 % | `--color-status-warn` | «En curso» |
| 04 Seguimiento | `color-mix(in srgb, var(--color-status-idle) 18%, var(--color-surface))` | `idle` al 26 % | `--color-status-idle` | «Finalizada» |

**Excepción de marca, acotada.** El azul de marca sigue reservado para la acción primaria y el foco, con una sola excepción: el capítulo 01 de la visita, donde aparece como lavado, resplandor, punto y barra de progreso. Nunca como texto, botón ni relleno sólido, y en ninguna otra sección. La banda de la visita no tiene botón primario (solo el enlace de texto «Comenzar gratis»), así que el lavado azul nunca comparte pantalla con un botón azul y no le quita fuerza.

**Accesibilidad del color.** Ningún estado depende solo del color: cada punto va con su texto y cada pestaña con número y estado. La barra de progreso es decorativa (`aria-hidden`); el ámbar y el pizarra quedan por debajo de 3:1 sobre blanco, y es aceptable solo porque la barra no transmite información. El texto de la card nunca va sobre la tinta, así que su contraste no cambia.

**Forma del lavado.**
- Un solo tono. Nunca dos colores mezclados, nunca manchas orgánicas.
- Móvil: el escenario ocupa la mitad inferior de la card. Degradado vertical, transparente arriba y tinta al 100 % en el borde inferior.
- Escritorio: el escenario es la columna derecha. Degradado diagonal, transparente en el borde izquierdo de la columna y tinta al 100 % en la esquina inferior derecha.
- El resplandor es un `radial-gradient` elíptico centrado detrás del mock, del color del resplandor a transparente al 70 %. Le da al mock un halo de su propio tono, como el de Calendly, sin blur pesado.
- No hay texto sobre la tinta, salvo lo que trae el propio mock.

Los puntos de la línea de tiempo no usan el color del capítulo. Usan el estado real de cada línea (`idle`, `ok`, `warn`), con las clases `status-dot` que ya existen. El color del capítulo solo está en el lavado, el resplandor, el punto del kicker, el punto de la pestaña y la barra de progreso.

### 5.2 Tabla de cards

| Card | Superficie | Tinta | Sombra | Origen del color |
| --- | --- | --- | --- | --- |
| Visita 01 | `--color-surface`, `--radius-xl` | `--tint-cita` + resplandor en el escenario | Card `--shadow-surface`; mock `--shadow-card-hover` al terminar de aterrizar | Lavado azul suave + producto (bloques de cita) |
| Visita 02 | Igual | `--tint-ingreso` + resplandor | Igual | Lavado verde + producto (checks de ingreso) |
| Visita 03 | Igual | `--tint-ficha` + resplandor | Igual | Lavado ámbar + producto (estado en curso, visitas) |
| Visita 04 | Igual | `--tint-seguimiento` + resplandor | Igual | Lavado pizarra + producto (nota, próxima cita) |
| Cómo empezar 01–03 | `--color-surface` sobre banda `--color-frame`, `--radius-lg` | Ninguna | Card `--shadow-card`; mock `--shadow-card` | Solo producto. Pastilla del número: `--color-frame` con texto `--color-ink-mid`, Outfit con cifras tabulares |
| Bento · Panel principal | `--color-surface`, `--radius-lg` | Ninguna; escenario `--color-frame` | `--shadow-card`; mock `--shadow-card` | Solo producto (estados de cita) |
| Bento · cuatro tiles | `--color-surface` | Ninguna; escenario `--color-frame`. Se quitan el `color-mix` por categoría y la barra de acento de 3 px | La doble sombra actual del tile | Solo producto |
| Calendarios | `--color-surface` (se quita el 2,5 % de marca) | Ninguna | `--shadow-card` en la franja, iconos sin cambio | Solo los logos de Google y Apple |
| Problema | Como hoy | El escenario del caso 1 pasa de `--color-brand` 5,5 % a `--color-frame`. La burbuja de salida pasa de marca 12 % a `--color-ink` 6 % | Como hoy | Neutro: el problema es gris para que la visita se lea como el después |

Cómo empezar sigue el patrón de Cal: número en pastilla dentro de la card, arriba a la izquierda (deja de flotar sobre una línea conectora); luego título y línea; el mock al final, recortado por el borde inferior de la card, sin escenario gris interior. Se quitan la línea conectora horizontal y el rail vertical: el `ol` y los números ya dan el orden. En escritorio, tres columnas de igual altura.

Se quita el levantamiento al pasar el cursor en el bento y en los casos del problema. No son enlaces, y moverse al hover promete un clic que no existe.

---

## 6. Movimiento

Principio: **la escena entra una vez y se queda.** El texto no se mueve después de aparecer. Solo cambia el estado del producto. Nada da vueltas, salvo el flotar del hero y el «Sin respuesta» del problema.

Para que llame la atención, cada card de la visita tiene una entrada con cuatro tiempos, siempre en el mismo orden y con una sola cosa moviéndose a la vez:

1. **La card ya está ahí** (0 ms): el texto y la superficie blanca son visibles desde el inicio, sin fundido ni desplazamiento. Sin JS, o si el script falla, la card se ve completa con la tinta puesta. El estado inicial oculto solo se aplica bajo `.js`, como el resto del sitio.
2. **La tinta sube** (120 ms): el lavado se revela desde el borde inferior hacia arriba en 700 ms con `--ease-out`. Se anima con `clip-path: inset(100% 0 0 0)` → `inset(0)` sobre un pseudo-elemento. Es una revelación, no un estiramiento: el degradado no se deforma. El resplandor aparece en opacidad al mismo tiempo. Es el gesto característico de la sección: la visita se va llenando.
3. **El mock aterriza** (280 ms): escala de 0,96 a 1 en 520 ms. La sombra no se anima con `box-shadow`. Un pseudo-elemento con `--shadow-card-hover` pasa de opacidad 0 a 1 encima de la sombra base `--shadow-card`. Se posa sobre la tinta.
4. **El estado protagonista** (600 ms): un solo cambio de producto por capítulo, más visible que el resto.
   - 01: el bloque «Jue · 17:00» baja 8 px hasta su hueco en la agenda y toma su color.
   - 02: los checks del ingreso se marcan uno tras otro, con 80 ms entre ellos.
   - 03: las filas de visitas anteriores aparecen una tras otra (opacidad y 6 px de `translateY` por fila, sin animar `height`) y la nota previa aparece al final.
   - 04: aparece el chip «Próxima cita agendada».

Después, los puntos de la línea de tiempo pasan de gris a su estado a 760, 860 y 960 ms. Cada uno suelta **un** anillo de su color que se expande y se desvanece en 600 ms. El anillo no se repite.

Límites, para no pasarse:
- Cada card termina en 1,2 s como máximo.
- Desplazamiento máximo de 12 px. Escala mínima de 0,96, nunca por encima de 1.
- Sin rebote: siempre `--ease-out`, nunca curvas con sobreimpulso.
- Nada en bucle dentro de la visita. Sin parallax ni control del scroll.
- Solo se animan `opacity`, `transform` y `clip-path`. Nada de `height`, `top`, márgenes ni `box-shadow`. `will-change` solo mientras dura la entrada.
- La salida es más rápida que la entrada: al cambiar de pestaña, el texto saliente se va en 200 ms y el entrante llega en `--duration-crossfade`.

### 6.1 Qué se anima y cuándo

| Dónde | Qué | Cuándo | Cómo |
| --- | --- | --- | --- |
| Hero | Panel flota 3 px; señales entran y flotan | Mientras el hero está en pantalla | Como hoy. Sin `HeroVisitSequence` |
| Problema | Burbujas, filas vacías y avisos entran; «Sin respuesta» respira | Una vez al entrar; la respiración solo en pantalla | Como hoy |
| Visita, móvil | La entrada en cuatro tiempos: card, tinta que sube, mock que aterriza, estado protagonista. Después los puntos con su anillo | Una vez por card, al cruzar ~30 % del viewport | Ver arriba |
| Visita, escritorio | Al entrar la sección, el capítulo 01 corre la misma entrada | Una vez | Igual |
| Visita, escritorio | Autoplay **01 → 04, una sola pasada**, ~6 s por capítulo. Se detiene en 04 con la barra de progreso completa y no vuelve a empezar. La barra usa el color clave del capítulo | Arranca al estar en pantalla; se pausa fuera, con hover y con foco; un clic o una flecha lo apaga para siempre | Hoy hace bucle (`% tabs.length`); deja de hacerlo. Si sales antes de terminar, sigue donde iba al volver |
| Visita, escritorio | Cambio de capítulo: el texto cruza en opacidad sin moverse. Luego la tinta nueva sube, el mock aterriza y corre el estado protagonista del capítulo (pasos 2 a 4 de la entrada) | Al cambiar de pestaña | `--duration-crossfade` para el texto. Se quita el `translateY` de entrada y de salida del panel |
| Cómo empezar | Bloques de disponibilidad, filas de servicios y campos del formulario entran una vez | Al entrar cada card, escalonado 90 ms | Estados de producto existentes |
| Bento | Filas del panel y estados de cada tile entran una vez | Al entrar | Como hoy, sin flotar |
| Precios, FAQ | Cambio del toggle, altura del acordeón | Al usarlos | Como hoy |

### 6.2 Qué no se anima

- Títulos, remates y textos: entran con su bloque y se quedan quietos. Ni rebote, ni palabra por palabra, ni cambio de color.
- El flotar ambiental de 3 px queda solo en el hero. Se quita de los mocks de la visita, de Cómo empezar, del bento y de los iconos de calendarios (la franja es quieta).
- La tinta sube una vez al entrar y ahí se queda. No cambia de tono, no respira y no se desplaza con el scroll.
- No hay elementos atenuados que se encienden al bajar, ni nada pegado que se desplace con el scroll.
- La pestaña seleccionada no se desliza: cambia de fondo en 160 ms.

### 6.3 Con `prefers-reduced-motion: reduce`

- Todo aparece en su estado final: cards visibles, tinta y resplandor completos, mock a escala 1 con su sombra final, estado protagonista ya resuelto, puntos de la línea de tiempo con su color final y sin anillo.
- Escritorio: sin autoplay, capítulo 01 seleccionado, cambio de pestaña instantáneo y subrayado lleno en la pestaña activa.
- Ningún flotar, tampoco en el hero. «Sin respuesta» queda fijo, a opacidad completa.
- El salto desde «Ver una visita» a `#recorrido` es instantáneo; `scroll-behavior: smooth` solo con `no-preference`.

---

## 7. Lo que vimos y no traemos

**De Calendly**

- **Degradados de varios tonos** (azul con violeta, naranja con lima) y el escenario azul saturado del catálogo. Son su paleta y competirían con `#1769e0`. Aquí la tinta es de un tono, suave y tomada del producto.
- **Carrusel del hero con iconos y títulos que se cruzan** (captura 0). Es justo el rebote de títulos que evitamos; nuestro hero es el panel quieto.
- **Catálogo que se enciende al bajar** (capturas 5–7). Convierte el inventario en otro relato y obliga a seguir el scroll. Nuestro bento es estático.
- **Título con serifa** en el catálogo. La marca es solo Outfit.
- **Iconos de producto como viñetas** (Callie, Notetaker). No tenemos submarcas; usamos los puntos de estado.
- **Logos flotando sobre los mocks** (Gmail, Outlook en Follow up), **muro de 150+ integraciones**, **testimonios con foto y métrica** («75 hours saved monthly»), **carrusel de fotos en el cierre**, **burbuja de chat** y **registro con Google o Microsoft**. Logos, métricas y testimonios inventados están fuera; el registro vive en el panel.

**De Cal**

- **Cruces y líneas finas en las esquinas** de las secciones. Es profundidad con borde; aquí es sombra.
- **Números en monoespaciada.** Tomamos la pastilla, no la tipografía.
- **Órbita de logos de calendario** en el paso 01. Son logos de más y una animación en bucle.
- **«Reserva una demostración» y «Habla con ventas»** como segundo botón. No hay ventas en la homepage, salvo el enlace de Empresas en precios.
- **Widget de reserva en el hero.** Sería un widget interactivo falso; el hero sigue siendo el panel.
- **«…¡y mucho más!» con rejilla de iconos.** Es sopa de iconos; el bento usa mocks enfocados.
- **Franja de logos y muro de testimonios.** No tenemos logos reales.
- **Mock que se sale por la derecha** de la card (capturas 0 y 1). En móvil corta contenido en horizontal; aquí se recorta solo por abajo.
- **Cards fantasma apiladas detrás del mock** (capturas 3 y 4). Se leen como bordes.

---

## 8. Cambios ya aplicados en `docs/SITE.md`

- §5 «Shipped order»: Hero → Problema → Visita (`#recorrido`) → Cómo empezar (`#como-empezar`) → bento → Calendarios → Precios → FAQ → Cierre.
- §5.1: segundo botón «Ver una visita» → `#recorrido`; quitar la secuencia de estados del hero.
- §5.3: escenarios del problema en neutro.
- §5.4: renombrar a Cómo empezar, con los pasos, el lead, el patrón de pastilla y sin el ghost.
- §5.6: mover tras el problema, banda paper, tarjetas apiladas en móvil, autoplay de una pasada en escritorio, tintas por capítulo.
- §5.7: nuevo lead y copy de tiles, sin acentos de categoría, sin hover; puentes vigentes: solo «El chat no es un sistema.» (reescrito) y «El plan cubre la operación.».
- §5.9: franja quieta, sin tinte de marca, nota de plan.
- §9 Motion y reglas: el flotar solo en el hero; la entrada en cuatro tiempos de la visita, una vez, con sus límites; sin la secuencia del hero; las tintas son exclusivas de la visita; regla de notas de plan.
- §9 Brand: añadir la excepción acotada del capítulo 01 (marca como lavado, resplandor, punto y barra de progreso; nunca texto, botón ni relleno).
- §9 «Dual CTAs»: cambiar «Ver cómo funciona» por «Ver una visita».
