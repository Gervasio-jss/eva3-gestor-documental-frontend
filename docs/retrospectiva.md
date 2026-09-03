# Retrospectiva y mejora continua (Punto 13)

## Oportunidades de mejora identificadas

| # | Situación / problema | Mejora propuesta | Prioridad | Responsable propuesto | Acción a realizar |
|---|---|---|---|---|---|
| 1 | El listado no pagina: con muchos años de documentos acumulados, cargar todo de una vez afectará el rendimiento. | Agregar paginación o "scroll infinito" en `DocumentList`, delegando el límite/offset al Backend. | Alta | Integrante a cargo del consumo de endpoints | Definir parámetros `page`/`limit` junto al equipo de Backend y ajustar `documentosApi.listar`. |
| 2 | No existen roles de usuario: cualquiera que abra la app puede eliminar cualquier documento. | Incorporar autenticación y permisos (p. ej. solo dirección puede eliminar). | Alta | Integrante a cargo de seguridad | Coordinar con Backend el esquema de autenticación antes de la siguiente iteración. |
| 3 | Los documentos no admiten adjuntar el archivo original (PDF/Word), solo metadatos. | Agregar carga y descarga de archivo adjunto por documento. | Media | Integrante a cargo de componentes | Diseñar el componente de carga de archivos y validar tipos/tamaño permitidos. |

## Mejora seleccionada e implementada dentro del alcance de esta evaluación

Se seleccionó una variante acotada de la oportunidad #1: aunque la
paginación completa requiere coordinación con el Backend, sí se
implementó la **búsqueda con debounce** (ver `docs/problema-tecnico.md`)
como primer paso hacia un listado más eficiente, ya que reduce de
inmediato la carga de solicitudes sin depender de cambios en el Backend.

## Cómo se tomó la decisión

El equipo priorizó las tres oportunidades según impacto en el usuario
directivo (que administra la escuela día a día) versus esfuerzo de
coordinación con otros equipos. Las dos primeras dependen de decisiones
que exceden el alcance del Frontend (autenticación, paginación en el
Backend), por lo que se documentaron como trabajo futuro, mientras que la
optimización de búsqueda podía implementarse íntegramente dentro del
Frontend y entregar valor inmediato.

## Gestión de la participación del equipo

Cada integrante revisó las tres propuestas de forma individual y las
discutió en una reunión breve antes de la entrega, dejando registrada la
decisión final en este documento para que quede como antecedente de cara
a la siguiente iteración del proyecto.
