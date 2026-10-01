# Design Critique: Pokédex v1.0

Revisión hecha sobre la app publicada (escritorio 1280 px y móvil 390 px, en modo claro y oscuro) y su código. Etapa: producto terminado, en fase de pulido.

## Overall Impression

La base visual es sólida: los artworks son grandes, los colores por tipo son consistentes y la grilla se lee bien. La mayor oportunidad está en el **detalle en escritorio**. Ahí la información queda escondida detrás de tabs aunque sobra espacio, y la cabecera tiene elementos que se pisan. Le siguen la **densidad de controles en móvil** y un **set de iconos inconsistente**: hoy se mezclan emojis con SVG.

## Usability

| Finding | Severity | Recommendation |
|---|---|---|
| En escritorio, Stats y Evolución están detrás de tabs aunque la columna derecha queda vacía. Ver los datos clave cuesta 2 clics. | 🔴 Critical | En pantallas ≥ 1024 px usar dos columnas: la cabecera fija (sticky) a la izquierda y Info, Stats y Evolución apiladas a la derecha. Mantener los tabs solo en móvil. |
| La cadena evolutiva no dice **cómo** evoluciona cada Pokémon (nivel, piedra, intercambio). Es la pregunta más común en una Pokédex. | 🟡 Moderate | Mostrar la condición en cada etapa: "Nv. 16", "Piedra Fuego", "Intercambio", "Amistad". |
| En móvil, los controles (búsqueda, chips, generación, favoritos, contador) ocupan unos 300 px de alto, el **35 % de la primera pantalla**, antes de la primera tarjeta. | 🟡 Moderate | Juntar generación, favoritos y contador en una sola fila compacta y ocultar visualmente la etiqueta "Generación". |
| Con 1025 Pokémon y scroll infinito, no hay forma rápida de volver arriba para cambiar un filtro. | 🟡 Moderate | Agregar un botón flotante "Volver arriba" que aparezca al pasar los ~1200 px de scroll. |
| En móvil los chips de tipo desbordan hacia la derecha sin ninguna señal de que hay más. Además, si el tipo activo es Hada, el chip queda fuera de la pantalla y no se ve qué filtro está aplicado. | 🟡 Moderate | Agregar un desvanecido en los bordes como pista de scroll y llevar el chip activo a la vista automáticamente. |
| El contador del header "★ 0" parece un puntaje y no deja claro que es la entrada a los favoritos. | 🟢 Minor | Mostrar la etiqueta "Favoritos" desde ≥ 640 px y marcarlo como activo cuando se está en esa vista. |
| No hay atajo de teclado para buscar, algo habitual en apps de consulta. | 🟢 Minor | Atajo `/` para enfocar la búsqueda, con la pista `/` visible en escritorio. |
| Los botones Anterior / Siguiente son solo texto y no muestran a qué Pokémon llevan. | 🟢 Minor | Agregar una miniatura del sprite. |

## Visual Hierarchy

- **Qué atrae la mirada primero:**
  - En la Home, el artwork de cada tarjeta. Es correcto.
  - En el detalle, el artwork compite con la marca de agua `#025`, que en móvil queda detrás de los botones de acción (🔊 ✨ ☆) y se pisa con ellos.
- **Orden de lectura en el detalle:** Volver → botones → artwork → número → nombre → tipos. El número aparece **dos veces**: en la marca de agua y bajo el artwork.
- **Énfasis:**
  - El rojo de la marca se usa para "Volver", "Limpiar", "Reintentar", el foco y también para resaltar **el Pokémon actual en la cadena evolutiva**. En ese último uso el rojo se lee como error o alerta.
  - La marca de agua debería quedar centrada detrás del artwork y más tenue, para que no compita con los botones.

## Consistency

| Element | Issue | Recommendation |
|---|---|---|
| Iconografía | Se mezclan emojis (🌙 ☀️ 🔊 ✨ ★ ☆), que cambian según el sistema operativo, con SVG (Pokébola, lupa). En Windows, 🔊 y 🌙 se ven planos y desalineados. | Usar un set único de iconos SVG con trazo de 2 px y `currentColor`. |
| Botones de icono | Los botones de la cabecera del detalle tienen tamaños distintos: `px-3 py-1.5` en 🔊 y Shiny, y `h-9 w-9` en ☆. Los del header miden 36 px. | Un componente `IconButton` único de 40 × 40 px. |
| Superficies en oscuro | El fondo es `#121218` (neutro con un tono violeta), pero las tarjetas y paneles usan `slate` (azulado). Se nota un desfase de matiz. | Usar `slate-950` como fondo oscuro, alineado con las superficies. |
| Acento del actual en evolución | Anillo rojo, cuando el resto de los estados activos usa el color del tipo o neutro. | Anillo neutro (`slate-900` / `white`). |

## Accessibility

- **Contraste de color:** ✅ AA en texto secundario y badges (ya corregido en v1.0).
- **Tamaños táctiles:** ⚠️ Favorito (36 px), botones del header (36 px) y botones de la cabecera (~32 px) pasan el mínimo AA de 24 px (WCAG 2.5.8), pero quedan por debajo de los 44 px recomendados para móvil. Subir a 40 px y ampliar el área táctil.
- **Lectores de pantalla:** ⚠️ los emojis se leen en voz alta ("chispas Shiny", "estrella"). Con SVG `aria-hidden` y nombres accesibles explícitos se evita.
- **Legibilidad:** ✅ Inter con 16 px de base en la búsqueda; las descripciones usan `leading-relaxed`.

## What Works Well

- Los colores por tipo están aplicados de forma sistemática en chips, badges, tinte de las tarjetas y degradado de la cabecera. El usuario aprende rápido a asociar color con tipo.
- Hay estados completos: carga (skeletons), error con reintento, vacío con acción, y vacío de favoritos con instrucción.
- Los filtros viven en la URL y el scroll se restaura al volver, así que no se pierde contexto.
- La cuadrícula responsive se mantiene ordenada desde 2 hasta 6 columnas, con tarjetas de altura uniforme.

## Priority Recommendations

1. **Detalle en dos columnas en escritorio, sin tabs.** Se pasa de 3 vistas a 1, se aprovecha el espacio libre y el usuario compara stats y evoluciones de un vistazo.
2. **Condiciones de evolución** ("Nv. 16", "Piedra Agua", "Intercambio"). Es el dato que falta y más se busca.
3. **Iconos SVG unificados y botones de 40 px.** Dan consistencia entre sistemas operativos, mejores áreas táctiles y lectores de pantalla limpios.
4. **Cabecera del detalle despejada.** Marca de agua centrada detrás del artwork y botones de acción en una fila propia.
5. **Controles compactos en móvil y botón "Volver arriba".** Más contenido en la primera pantalla y regreso rápido a los filtros.
6. **Detalles menores:** desvanecido en los chips y chip activo visible, header "Favoritos", atajo `/`, miniaturas en Anterior/Siguiente, anillo neutro en la evolución actual y fondo oscuro alineado.
