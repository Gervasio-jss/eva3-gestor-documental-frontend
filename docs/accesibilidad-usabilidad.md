# Accesibilidad y usabilidad (Punto 3 y Punto 7)

## Criterios WCAG 2.1 aplicados

| Criterio WCAG 2.1 | Cómo se aplicó |
|---|---|
| 1.4.3 Contraste mínimo | Paleta verificada para contraste AA: texto principal `#23291F` sobre fondo `#F6F4EF`; botones primarios `#F6F4EF` sobre `#35604A`. |
| 1.3.1 Información y relaciones | Tabla de documentos usa `<th scope="col">` y `<th scope="row">`; el formulario asocia cada `<label>` con su campo mediante `htmlFor`/`id`. |
| 2.1.1 Teclado | Toda acción (ver, editar, eliminar, guardar, cancelar) es accesible solo con teclado; los modales devuelven el foco y se cierran con `Escape`. |
| 2.4.1 Evitar bloques | Se agregó un enlace "Saltar al contenido principal" (`skip-link`) antes de la barra lateral. |
| 2.4.7 Foco visible | `:focus-visible` con contorno de 3px en todos los elementos interactivos, en vez de depender del estilo por defecto del navegador. |
| 3.3.1 / 3.3.3 Identificación y sugerencia de errores | Los campos inválidos usan `aria-invalid="true"` y `aria-describedby` apuntando al mensaje de error, que además tiene `role="alert"`. |
| 4.1.3 Mensajes de estado | `StatusMessage` usa `role="status"` (info/éxito) o `role="alert"` (error) con `aria-live="polite"` para que un lector de pantalla anuncie el resultado de crear/editar/eliminar sin que el usuario deba buscarlo visualmente. |

## Prueba de usabilidad/accesibilidad realizada

**Método:** revisión con un integrante del equipo que no participó en el
desarrollo del formulario, navegando la aplicación únicamente con teclado
(Tab / Shift+Tab / Enter / Escape) y con el zoom del navegador al 200%.

**Criterio evaluado:** que una persona pudiera crear un documento nuevo de
principio a fin sin usar el mouse.

**Problema identificado:** al abrir el modal de "Nuevo documento", el foco
del teclado permanecía en el botón "+ Nuevo documento" de fondo, por lo
que había que presionar Tab varias veces (pasando por elementos ocultos
detrás del overlay) para llegar al primer campo del formulario.

**Mejora implementada:** se agregó `autoFocus` al primer campo del
formulario (`título`) dentro de `DocumentForm`, y se replicó el mismo
patrón de "foco automático al primer control interactivo" en
`ConfirmDialog` (foco en el botón "Eliminar"), de modo que abrir cualquier
modal deja el foco listo para continuar de inmediato.

## Revisión de usabilidad del listado (Punto 7)

Al mostrar la lista a un integrante externo al desarrollo, se observó que
al eliminar un documento no quedaba claro si la acción se completó o si
solo se cerró el cuadro de confirmación.

**Mejora de usabilidad implementada:** tras cada acción (crear, editar,
eliminar) se muestra un `StatusMessage` de confirmación en la parte
superior de la página ("Documento eliminado correctamente."), visible
tanto para usuarios videntes como anunciado automáticamente para lectores
de pantalla gracias a `aria-live="polite"`.
